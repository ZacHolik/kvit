import { NextResponse } from 'next/server';

import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import { createClient } from '@/lib/supabase/server';

type StatusPayload = {
  status: 'izdano' | 'placeno' | 'stornirano';
  datumPlacanja?: string;
};

function opisStornoKprUnosaZaRacun(brojRacuna: string) {
  return `Storno računa ${brojRacuna}`;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const body = (await request.json()) as StatusPayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: invoice, error: invoiceError } = await supabase
    .from('racuni')
    .select('id, broj_racuna, ukupni_iznos, nacin_placanja, datum, status')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: 'Racun nije pronaden.' }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from('racuni')
    .update({
      status: body.status,
      datum_placanja: body.status === 'placeno' ? body.datumPlacanja || invoice.datum : null,
    })
    .eq('id', invoice.id)
    .eq('user_id', user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  if (body.status === 'placeno' && invoice.status !== 'placeno') {
    const { data: existing } = await supabase
      .from('kpr_unosi')
      .select('id')
      .eq('user_id', user.id)
      .eq('racun_id', invoice.id)
      .maybeSingle();

    // TODO: If partial payments are introduced, replace this de-dup check with installment logic.
    if (!existing) {
      const isCash = invoice.nacin_placanja === 'gotovina';
      await supabase.from('kpr_unosi').insert({
        user_id: user.id,
        racun_id: invoice.id,
        datum: body.datumPlacanja || invoice.datum,
        broj_temeljnice: invoice.broj_racuna,
        opis: opisAutomatskogKprUnosaZaRacun(invoice.broj_racuna),
        iznos_gotovina: isCash ? Number(invoice.ukupni_iznos) : 0,
        iznos_bezgotovinsko: isCash ? 0 : Number(invoice.ukupni_iznos),
        ukupno: Number(invoice.ukupni_iznos),
      });
    }
  }

  if (body.status === 'stornirano' && invoice.status !== 'stornirano') {
    const isCash = invoice.nacin_placanja === 'gotovina';
    const amount = Number(invoice.ukupni_iznos) * -1;
    await supabase.from('kpr_unosi').insert({
      user_id: user.id,
      racun_id: invoice.id,
      datum: new Date().toISOString().slice(0, 10),
      broj_temeljnice: `STORNO ${invoice.broj_racuna}`,
      opis: opisStornoKprUnosaZaRacun(invoice.broj_racuna),
      iznos_gotovina: isCash ? amount : 0,
      iznos_bezgotovinsko: isCash ? 0 : amount,
      ukupno: amount,
    });
  }

  return NextResponse.json({ success: true });
}
