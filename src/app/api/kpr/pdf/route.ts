import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

import { KprDocument } from '@/lib/pdf/kpr-document';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: kprUnosi } = await supabase
    .from('kpr_unosi')
    .select('datum, broj_temeljnice, opis, iznos_gotovina, iznos_bezgotovinsko, ukupno')
    .eq('user_id', user.id)
    .order('datum', { ascending: false });

  const doc = KprDocument({
    title: 'KPR - Knjiga prometa',
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
      'Content-Disposition': 'attachment; filename="kpr-izvoz.pdf"',
    },
  });
}
