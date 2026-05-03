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

function joinAddress(
  street?: string | null,
  postalCode?: string | null,
  city?: string | null,
  fallback?: string | null,
) {
  const structured = [
    street?.trim(),
    [postalCode?.trim(), city?.trim()].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ');
  return structured || fallback || null;
}

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
      .select(
        'naziv_obrta, oib, adresa, ulica, postanski_broj, grad, opcina, sifra_opcine, vlasnik_ime, vlasnik_ulica, vlasnik_postanski_broj, vlasnik_grad, vlasnik_sifra_opcine, adresa_ista, godisnji_primici_prosle_godine, kvit_plan, pro_expires_at',
      )
      .eq('id', user.id)
      .maybeSingle(),
    zbrojiKprZaGodinu(supabase, user.id, godina),
  ]);

  const proOk =
    profil?.kvit_plan === 'pro' ||
    (profil?.pro_expires_at &&
      new Date(profil.pro_expires_at as string) > new Date());
  if (!proOk) {
    return NextResponse.json(
      { error: 'PDF je dostupan uz PRO ili nagradni PRO pristup.' },
      { status: 403 },
    );
  }

  const { zbroj, izvorOnboardinga } = applyPoSdOnboardingPrimici(
    godina,
    kprZbroj,
    profil?.godisnji_primici_prosle_godine,
  );

  const razred = getPausalRazred2026(zbroj.ukupno);
  const useBusinessAddress = profil?.adresa_ista !== false;
  const businessAddress = joinAddress(
    profil?.ulica,
    profil?.postanski_broj,
    profil?.grad,
    profil?.adresa,
  );
  const ownerAddress = useBusinessAddress
    ? businessAddress
    : joinAddress(
        profil?.vlasnik_ulica,
        profil?.vlasnik_postanski_broj,
        profil?.vlasnik_grad,
        businessAddress,
      );
  const poSdSifraOpcine = useBusinessAddress
    ? profil?.sifra_opcine
    : profil?.vlasnik_sifra_opcine;
  const opcina = findOpcinaBySifra(poSdSifraOpcine);
  const doc = PoSdDocument({
    godina,
    nazivObrta: profil?.naziv_obrta ?? '—',
    vlasnikIme: profil?.vlasnik_ime ?? null,
    oib: profil?.oib ?? '—',
    adresa: ownerAddress,
    poslovnaAdresa: businessAddress,
    sifraOpcine: poSdSifraOpcine ?? null,
    nazivOpcine: opcina?.naziv ?? (useBusinessAddress ? profil?.opcina : null),
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
