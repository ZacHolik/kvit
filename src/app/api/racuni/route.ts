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
  kupac: {
    naziv: string;
    oib?: string;
    adresa?: string;
    email?: string;
  };
  stavka: {
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
  };
};

export async function POST(request: Request) {
  const supabase = createClient();
  const body = (await request.json()) as InvoicePayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ukupno = Number(body.stavka.kolicina) * Number(body.stavka.jedinicnaCijena);

  const { data: kupac, error: kupacError } = await supabase
    .from('kupci')
    .insert({
      user_id: user.id,
      naziv: body.kupac.naziv,
      oib: body.kupac.oib || null,
      adresa: body.kupac.adresa || null,
      email: body.kupac.email || null,
    })
    .select('id')
    .single();

  if (kupacError) {
    return NextResponse.json({ error: kupacError.message }, { status: 400 });
  }

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
    })
    .select('id, broj_racuna')
    .single();

  if (racunError) {
    return NextResponse.json({ error: racunError.message }, { status: 400 });
  }

  const { error: stavkaError } = await supabase.from('stavke_racuna').insert({
    racun_id: racun.id,
    opis: body.stavka.opis,
    kolicina: body.stavka.kolicina,
    jedinicna_cijena: body.stavka.jedinicnaCijena,
    ukupno,
  });

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
