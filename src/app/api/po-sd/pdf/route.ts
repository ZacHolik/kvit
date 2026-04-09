import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

import { getPausalRazred2026 } from '@/lib/pausal-tax';
import { PoSdDocument } from '@/lib/pdf/po-sd-document';
import { zbrojiKprZaGodinu } from '@/lib/po-sd-data';
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
  const godinaRaw = searchParams.get('year');
  const godina = godinaRaw ? Number.parseInt(godinaRaw, 10) : new Date().getFullYear() - 1;

  if (Number.isNaN(godina) || godina < 2000 || godina > 2100) {
    return NextResponse.json({ error: 'Neispravna godina.' }, { status: 400 });
  }

  const [{ data: profil }, zbroj] = await Promise.all([
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa')
      .eq('id', user.id)
      .maybeSingle(),
    zbrojiKprZaGodinu(supabase, user.id, godina),
  ]);

  const razred = getPausalRazred2026(zbroj.ukupno);
  const doc = PoSdDocument({
    godina,
    nazivObrta: profil?.naziv_obrta ?? '—',
    oib: profil?.oib ?? '—',
    adresa: profil?.adresa ?? null,
    gotovina: zbroj.gotovina,
    bezgotovinsko: zbroj.bezgotovinsko,
    ukupnoPrimici: zbroj.ukupno,
    razredLabel: razred?.label ?? '—',
    porezKvartalno: razred?.porezKvartalnoEur ?? 0,
    porezGodisnje: razred?.porezGodisnjeEur ?? 0,
  });

  const stream = await renderToStream(doc);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="po-sd-${godina}-pregled.pdf"`,
    },
  });
}
