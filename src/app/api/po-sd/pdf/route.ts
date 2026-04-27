import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

import { findOpcinaBySifra } from '@/lib/opcine';
import { getPausalRazred2026 } from '@/lib/pausal-tax';
import { PoSdDocument } from '@/lib/pdf/po-sd-document';
import {
  applyPoSdOnboardingPrimici,
  normalizePoSdGodina,
  zbrojiKprZaGodinu,
} from '@/lib/po-sd-data';
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
  const godina = normalizePoSdGodina(searchParams.get('year'));

  const [{ data: profil }, kprZbroj] = await Promise.all([
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa, opcina, sifra_opcine, godisnji_primici_prosle_godine')
      .eq('id', user.id)
      .maybeSingle(),
    zbrojiKprZaGodinu(supabase, user.id, godina),
  ]);

  const { zbroj, izvorOnboardinga } = applyPoSdOnboardingPrimici(
    godina,
    kprZbroj,
    profil?.godisnji_primici_prosle_godine,
  );

  const razred = getPausalRazred2026(zbroj.ukupno);
  const opcina = findOpcinaBySifra(profil?.sifra_opcine);
  const doc = PoSdDocument({
    godina,
    nazivObrta: profil?.naziv_obrta ?? '—',
    oib: profil?.oib ?? '—',
    adresa: profil?.adresa ?? null,
    sifraOpcine: profil?.sifra_opcine ?? null,
    nazivOpcine: opcina?.naziv ?? profil?.opcina ?? null,
    gotovina: zbroj.gotovina,
    bezgotovinsko: zbroj.bezgotovinsko,
    ukupnoPrimici: zbroj.ukupno,
    primiciIzvorOnboardinga: izvorOnboardinga,
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
