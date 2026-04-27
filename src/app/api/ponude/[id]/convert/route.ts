import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: ponuda, error } = await supabase
    .from('ponude')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !ponuda) {
    return NextResponse.json({ error: 'Ponuda nije pronađena.' }, { status: 404 });
  }

  const { data: items } = await supabase
    .from('ponuda_items')
    .select('opis, kolicina, jedinicna_cijena, popust, ukupno')
    .eq('ponuda_id', ponuda.id);

  const { count } = await supabase
    .from('racuni')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);
  const brojRacuna = `${(count ?? 0) + 1}-${new Date().getFullYear()}`;

  const { data: existingKupac } = await supabase
    .from('kupci')
    .select('id')
    .eq('user_id', user.id)
    .ilike('naziv', ponuda.kupac_naziv)
    .maybeSingle();

  const kupacPayload = {
    user_id: user.id,
    naziv: ponuda.kupac_naziv,
    oib: ponuda.kupac_oib,
    adresa: ponuda.kupac_adresa,
    email: ponuda.kupac_email,
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

  const { data: racun, error: racunError } = await supabase
    .from('racuni')
    .insert({
      user_id: user.id,
      kupac_id: kupac.id,
      broj_racuna: brojRacuna,
      datum: new Date().toISOString().slice(0, 10),
      datum_placanja: null,
      nacin_placanja: 'ziro',
      ukupni_iznos: Number(ponuda.ukupno),
      status: 'izdano',
      tip_racuna: ponuda.kupac_oib ? 'R1' : 'R2',
      popust_racun: Number(ponuda.popust_racun ?? 0),
      rok_placanja: ponuda.rok_placanja,
      datum_dospijeca: ponuda.datum_dospijeca,
      dostava_iznos: Number(ponuda.dostava_iznos ?? 0),
      dostava_opis: ponuda.dostava_opis,
      barkod_enabled: true,
      recurring: false,
      recurring_interval: null,
      napomena: ponuda.napomena,
    })
    .select('id, broj_racuna')
    .single();

  if (racunError || !racun) {
    return NextResponse.json(
      { error: racunError?.message || 'Račun nije kreiran.' },
      { status: 400 },
    );
  }

  await supabase.from('invoice_items').insert(
    (items ?? []).map((item) => ({
      racun_id: racun.id,
      opis: item.opis,
      kolicina: item.kolicina,
      jedinicna_cijena: item.jedinicna_cijena,
      popust: item.popust ?? 0,
      ukupno: item.ukupno,
    })),
  );

  await supabase.from('ponude').update({ status: 'prihvacena' }).eq('id', ponuda.id);

  return NextResponse.json({ id: racun.id, brojRacuna: racun.broj_racuna });
}
