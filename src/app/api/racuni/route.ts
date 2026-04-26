import { NextResponse } from 'next/server';

import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import { createClient } from '@/lib/supabase/server';

type InvoicePayload = {
  brojRacuna: string;
  datum: string;
  datumPlacanja?: string;
  nacinPlacanja: 'ziro' | 'gotovina' | 'kartica';
  status: 'izdano' | 'placeno' | 'stornirano';
  napomena?: string;
  dodajBarkodPlacanja?: boolean;
  kupac: {
    naziv: string;
    oib?: string;
    adresa?: string;
    email?: string;
  };
  items?: Array<{
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
  }>;
  /** Backward compatibility for any older clients still sending one row. */
  stavka?: {
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
  };
};

type NormalizedItem = {
  opis: string;
  kolicina: number;
  jedinicnaCijena: number;
  ukupno: number;
};

function normalizeItems(body: InvoicePayload): NormalizedItem[] {
  const rawItems = Array.isArray(body.items)
    ? body.items
    : body.stavka
      ? [body.stavka]
      : [];

  return rawItems
    .map((item) => {
      const kolicina = Number(item.kolicina);
      const jedinicnaCijena = Number(item.jedinicnaCijena);
      return {
        opis: item.opis?.trim() ?? '',
        kolicina,
        jedinicnaCijena,
        ukupno: kolicina * jedinicnaCijena,
      };
    })
    .filter(
      (item) =>
        item.opis.length > 0 &&
        Number.isFinite(item.kolicina) &&
        item.kolicina > 0 &&
        Number.isFinite(item.jedinicnaCijena) &&
        item.jedinicnaCijena >= 0,
    );
}

async function upsertCatalogItem(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  item: NormalizedItem,
) {
  const { data: existing } = await supabase
    .from('artikli')
    .select('id')
    .eq('user_id', userId)
    .ilike('naziv', item.opis)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('artikli')
      .update({ jedinicna_cijena: item.jedinicnaCijena })
      .eq('id', existing.id)
      .eq('user_id', userId);
    return;
  }

  await supabase.from('artikli').insert({
    user_id: userId,
    naziv: item.opis,
    jedinicna_cijena: item.jedinicnaCijena,
  });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const body = (await request.json()) as InvoicePayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = normalizeItems(body);
  if (items.length === 0) {
    return NextResponse.json(
      { error: 'Dodaj barem jednu ispravnu stavku računa.' },
      { status: 400 },
    );
  }

  const kupacNaziv = body.kupac.naziv.trim();
  if (!kupacNaziv) {
    return NextResponse.json({ error: 'Naziv kupca je obavezan.' }, { status: 400 });
  }

  const ukupno = items.reduce((sum, item) => sum + item.ukupno, 0);

  const { data: existingKupac } = await supabase
    .from('kupci')
    .select('id')
    .eq('user_id', user.id)
    .ilike('naziv', kupacNaziv)
    .maybeSingle();

  const kupacPayload = {
    user_id: user.id,
    naziv: kupacNaziv,
    oib: body.kupac.oib?.trim() || null,
    adresa: body.kupac.adresa?.trim() || null,
    email: body.kupac.email?.trim() || null,
  };

  const kupacMutation = existingKupac
    ? supabase
        .from('kupci')
        .update(kupacPayload)
        .eq('id', existingKupac.id)
        .eq('user_id', user.id)
        .select('id')
        .single()
    : supabase.from('kupci').insert(kupacPayload).select('id').single();

  const { data: kupac, error: kupacError } = await kupacMutation;

  if (kupacError || !kupac) {
    return NextResponse.json(
      { error: kupacError?.message || 'Kupac nije spremljen.' },
      { status: 400 },
    );
  }

  await Promise.all(items.map((item) => upsertCatalogItem(supabase, user.id, item)));

  const { data: racun, error: racunError } = await supabase
    .from('racuni')
    .insert({
      user_id: user.id,
      kupac_id: kupac.id,
      broj_racuna: body.brojRacuna,
      datum: body.datum,
      datum_placanja: body.datumPlacanja || null,
      nacin_placanja: body.nacinPlacanja,
      ukupni_iznos: ukupno,
      status: body.status,
      napomena: body.napomena || null,
      dodaj_barkod_placanja:
        body.nacinPlacanja === 'ziro' ? body.dodajBarkodPlacanja !== false : false,
    })
    .select('id, broj_racuna')
    .single();

  if (racunError) {
    return NextResponse.json({ error: racunError.message }, { status: 400 });
  }

  const { error: stavkaError } = await supabase.from('invoice_items').insert(
    items.map((item) => ({
      racun_id: racun.id,
      opis: item.opis,
      kolicina: item.kolicina,
      jedinicna_cijena: item.jedinicnaCijena,
      ukupno: item.ukupno,
    })),
  );

  if (stavkaError) {
    return NextResponse.json({ error: stavkaError.message }, { status: 400 });
  }

  // TODO: Support multiple KPR entries per invoice for split payments in future.
  if (body.status === 'placeno') {
    const paymentDate = body.datumPlacanja || body.datum;
    const isCash = body.nacinPlacanja === 'gotovina';

    await supabase.from('kpr_unosi').insert({
      user_id: user.id,
      racun_id: racun.id,
      datum: paymentDate,
      broj_temeljnice: body.brojRacuna,
      opis: opisAutomatskogKprUnosaZaRacun(body.brojRacuna),
      iznos_gotovina: isCash ? ukupno : 0,
      iznos_bezgotovinsko: isCash ? 0 : ukupno,
      ukupno,
    });
  }

  return NextResponse.json({
    id: racun.id,
    brojRacuna: racun.broj_racuna,
  });
}
