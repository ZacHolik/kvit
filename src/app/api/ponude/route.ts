import { NextResponse } from 'next/server';

import { normalizeDocumentItems } from '@/lib/invoice-normalize';
import { createClient } from '@/lib/supabase/server';

type OfferPayload = {
  brojPonude: string;
  datum: string;
  datumValjanosti?: string;
  status: 'poslana' | 'prihvacena' | 'odbijena' | 'istekla';
  napomena?: string;
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
  }>;
};

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('ponude')
    .select('id, broj_ponude, datum, datum_valjanosti, kupac_naziv, status, ukupno')
    .eq('user_id', user.id)
    .order('datum', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ponude: data ?? [] });
}

export async function POST(request: Request) {
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

  const ukupno = items.reduce((sum, item) => sum + item.ukupno, 0);
  const { data: ponuda, error } = await supabase
    .from('ponude')
    .insert({
      user_id: user.id,
      broj_ponude: body.brojPonude,
      datum: body.datum,
      datum_valjanosti: body.datumValjanosti || null,
      kupac_naziv: body.kupac.naziv,
      kupac_oib: body.kupac.oib || null,
      kupac_adresa: body.kupac.adresa || null,
      kupac_email: body.kupac.email || null,
      status: body.status,
      napomena: body.napomena || null,
      ukupno,
    })
    .select('id, broj_ponude')
    .single();

  if (error || !ponuda) {
    return NextResponse.json(
      { error: error?.message || 'Ponuda nije spremljena.' },
      { status: 400 },
    );
  }

  const { error: itemsError } = await supabase.from('ponuda_items').insert(
    items.map((item) => ({
      ponuda_id: ponuda.id,
      opis: item.opis,
      kolicina: item.kolicina,
      jedinicna_cijena: item.jedinicnaCijena,
      ukupno: item.ukupno,
    })),
  );

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }

  return NextResponse.json({ id: ponuda.id, brojPonude: ponuda.broj_ponude });
}
