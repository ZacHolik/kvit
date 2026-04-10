import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

import { getKprExportYear, kprDatumRangeZaGodinu } from '@/lib/kpr-export';
import { KprDocument } from '@/lib/pdf/kpr-document';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const godina = getKprExportYear(searchParams);
  const { od, kraj } = kprDatumRangeZaGodinu(godina);

  const [{ data: kprUnosi }, { data: profil }] = await Promise.all([
    supabase
      .from('kpr_unosi')
      .select(
        'datum, broj_temeljnice, opis, iznos_gotovina, iznos_bezgotovinsko, ukupno',
      )
      .eq('user_id', user.id)
      .gte('datum', od)
      .lte('datum', kraj)
      .order('datum', { ascending: false }),
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  const doc = KprDocument({
    profil: {
      nazivObrta: profil?.naziv_obrta ?? '',
      oib: profil?.oib ?? '',
      adresa: profil?.adresa ?? null,
    },
    godina,
    items: (kprUnosi ?? []).map((item) => ({
      datum: item.datum,
      brojTemeljnice: item.broj_temeljnice ?? '-',
      opis: item.opis ?? '-',
      gotovina: Number(item.iznos_gotovina ?? 0),
      bezgotovinsko: Number(item.iznos_bezgotovinsko ?? 0),
      ukupno: Number(item.ukupno ?? 0),
    })),
  });

  const stream = await renderToStream(doc);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="kpr-${godina}.pdf"`,
    },
  });
}
