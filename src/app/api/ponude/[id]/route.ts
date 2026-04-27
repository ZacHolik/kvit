import { NextResponse } from 'next/server';

import { normalizeDocumentItems } from '@/lib/invoice-normalize';
import { createClient } from '@/lib/supabase/server';

type OfferPayload = {
  brojPonude: string;
  datum: string;
  datumValjanosti?: string;
  status: 'poslana' | 'prihvacena' | 'odbijena' | 'istekla';
  napomena?: string;
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
  items: Array<{
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
    popust?: number;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const body = (await request.json()) as OfferPayload;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = normalizeDocumentItems(body.items);
  if (items.length === 0) {
    return NextResponse.json(
      { error: 'Dodaj barem jednu ispravnu stavku ponude.' },
      { status: 400 },
    );
  }

  const kupacNaziv = body.kupac.naziv.trim();
  if (!kupacNaziv) {
    return NextResponse.json({ error: 'Naziv kupca je obavezan.' }, { status: 400 });
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

  const { data: ponuda, error } = await supabase
    .from('ponude')
    .update({
      broj_ponude: body.brojPonude,
      datum: body.datum,
      datum_valjanosti: body.datumValjanosti || null,
      kupac_naziv: kupacNaziv,
      kupac_oib: body.kupac.oib?.trim() || null,
      kupac_adresa: body.kupac.adresa?.trim() || null,
      kupac_email: body.kupac.email?.trim() || null,
      status: body.status,
      napomena: body.napomena || null,
      popust_racun: popustRacun,
      rok_placanja: body.rokPlacanja || '15 dana',
      datum_dospijeca: body.datumDospijeca || null,
      dostava_iznos: dostavaIznos,
      dostava_opis: dostavaOpis,
      ukupno,
    })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select('id, broj_ponude')
    .single();

  if (error || !ponuda) {
    return NextResponse.json(
      { error: error?.message || 'Ponuda nije spremljena.' },
      { status: 400 },
    );
  }

  const { error: deleteError } = await supabase
    .from('ponuda_items')
    .delete()
    .eq('ponuda_id', ponuda.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  const { error: itemsError } = await supabase.from('ponuda_items').insert(
    items.map((item) => ({
      ponuda_id: ponuda.id,
      opis: item.opis,
      kolicina: item.kolicina,
      jedinicna_cijena: item.jedinicnaCijena,
      popust: item.popust,
      ukupno: item.ukupno,
    })),
  );

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }

  return NextResponse.json({ id: ponuda.id, brojPonude: ponuda.broj_ponude });
}
