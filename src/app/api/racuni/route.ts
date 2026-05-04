import { NextResponse } from 'next/server';

import { fiscalizeRacun } from '@/lib/fiscalization/fiscalize';
import type { FiscalizationResult } from '@/lib/fiscalization/types';
import { normalizeDocumentItems } from '@/lib/invoice-normalize';
import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import { createClient } from '@/lib/supabase/server';

type InvoicePayload = {
  brojRacuna: string;
  datum: string;
  datumPlacanja?: string;
  nacinPlacanja: 'ziro' | 'gotovina' | 'kartica';
  status: 'izdano' | 'placeno' | 'stornirano';
  tipRacuna?: 'R1' | 'R2' | 'bez_oznake';
  napomena?: string;
  dodajBarkodPlacanja?: boolean;
  recurring?: boolean;
  recurringInterval?: 'mjesecno' | 'kvartalno' | 'godisnje';
  popustRacun?: number;
  rokPlacanja?: string;
  datumDospijeca?: string;
  dostava?: {
    enabled?: boolean;
    opis?: string;
    iznos?: number;
  };
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
    popust?: number;
  }>;
  /** Backward compatibility for any older clients still sending one row. */
  stavka?: {
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
    popust?: number;
  };
};

async function upsertCatalogItem(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  item: ReturnType<typeof normalizeDocumentItems>[number],
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

  const items = normalizeDocumentItems(
    Array.isArray(body.items) ? body.items : body.stavka ? [body.stavka] : [],
  );
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
  const tipRacuna = body.tipRacuna ?? 'R1';
  if (!['R1', 'R2', 'bez_oznake'].includes(tipRacuna)) {
    return NextResponse.json({ error: 'Tip računa nije ispravan.' }, { status: 400 });
  }
  if (tipRacuna === 'R1' && !body.kupac.oib?.trim()) {
    return NextResponse.json(
      { error: 'R1 račun zahtijeva OIB kupca.' },
      { status: 400 },
    );
  }
  const recurring = body.recurring === true;
  const recurringInterval: InvoicePayload['recurringInterval'] | null = recurring
    ? (body.recurringInterval ?? 'mjesecno')
    : null;
  if (
    recurring &&
    (!recurringInterval ||
      !['mjesecno', 'kvartalno', 'godisnje'].includes(recurringInterval))
  ) {
    return NextResponse.json(
      { error: 'Interval ponavljanja nije ispravan.' },
      { status: 400 },
    );
  }

  const popustRacun = Math.min(Math.max(Number(body.popustRacun ?? 0) || 0, 0), 100);
  const meduzbroj = items.reduce((sum, item) => sum + item.ukupno, 0);
  const popustRacunIznos = meduzbroj * (popustRacun / 100);
  const dostavaIznos =
    body.dostava?.enabled === true
      ? Math.max(Number(body.dostava.iznos ?? 0) || 0, 0)
      : 0;
  const dostavaOpis =
    body.dostava?.enabled === true
      ? body.dostava.opis?.trim() || 'Troškovi dostave'
      : null;
  const ukupno = Math.max(meduzbroj - popustRacunIznos + dostavaIznos, 0);

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
      tip_racuna: tipRacuna,
      popust_racun: popustRacun,
      rok_placanja: body.rokPlacanja || '15 dana',
      datum_dospijeca: body.datumDospijeca || null,
      dostava_iznos: dostavaIznos,
      dostava_opis: dostavaOpis,
      napomena: body.napomena || null,
      recurring,
      recurring_interval: recurringInterval,
      barkod_enabled:
        body.nacinPlacanja === 'ziro' ? body.dodajBarkodPlacanja !== false : false,
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
      popust: item.popust,
      ukupno: item.ukupno,
    })),
  );

  if (stavkaError) {
    return NextResponse.json({ error: stavkaError.message }, { status: 400 });
  }

  let fiscalResult: FiscalizationResult | undefined;

  const { data: profil } = await supabase
    .from('profiles')
    .select('oib')
    .eq('id', user.id)
    .maybeSingle();

  const { data: cert } = await supabase
    .from('fiscal_certificates')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (cert && profil?.oib?.trim()) {
    fiscalResult = await fiscalizeRacun({
      racunId: racun.id,
      userId: user.id,
      oib: profil.oib.trim(),
      brojRacuna: body.brojRacuna,
      ukupniIznos: ukupno,
      nacinPlacanja: body.nacinPlacanja,
    });

    if (fiscalResult.success) {
      await supabase
        .from('racuni')
        .update({
          zki: fiscalResult.zki,
          jir: fiscalResult.jir,
          fiskalizirano_at: new Date().toISOString(),
        })
        .eq('id', racun.id)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('racuni')
        .update({
          fiskalizacija_error: fiscalResult.error ?? 'Nepoznata greška',
        })
        .eq('id', racun.id)
        .eq('user_id', user.id);
    }
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
    fiskalizirano: fiscalResult?.success ?? false,
    jir: fiscalResult?.jir ?? null,
    fiskalError:
      fiscalResult?.success === false ? (fiscalResult.error ?? null) : null,
  });
}
