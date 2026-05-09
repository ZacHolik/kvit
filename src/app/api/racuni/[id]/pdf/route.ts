import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

import { normalizeHub3PozivNaBroj } from '@/lib/alati/hub3-eur';
import {
  formatBrojRacunaZaPdf,
  InvoiceDocument,
} from '@/lib/pdf/invoice-document';
import { buildInvoicePaymentHub3Block } from '@/lib/pdf/build-invoice-payment-hub3';
import { fiscalQrPngDataUrl } from '@/lib/fiscalization/fiscal-qr';
import { createClient } from '@/lib/supabase/server';

export async function GET(
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

  const [{ data: racun, error }, { data: profil }] = await Promise.all([
    supabase
      .from('racuni')
      .select(
        'id, broj_racuna, datum, datum_placanja, nacin_placanja, status, tip_racuna, tip_dokumenta, popust_racun, rok_placanja, datum_dospijeca, dostava_iznos, dostava_opis, ukupni_iznos, napomena, barkod_enabled, zki, jir, fiskalizirano_at, kupci(naziv, oib, adresa, email)',
      )
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa, ulica, postanski_broj, grad, iban')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  if (error || !racun) {
    return NextResponse.json({ error: 'Racun nije pronaden.' }, { status: 404 });
  }

  const { data: stavke } = await supabase
    .from('invoice_items')
    .select('opis, kolicina, jedinicna_cijena, popust, ukupno')
    .eq('racun_id', racun.id);

  const kupac = racun.kupci as {
    naziv?: string | null;
    oib?: string | null;
    adresa?: string | null;
    email?: string | null;
  } | null;

  const brojZaDatoteku = formatBrojRacunaZaPdf(racun.broj_racuna).replaceAll(
    '/',
    '-',
  );
  const iban = profil?.iban?.replace(/\s/g, '').trim() ?? '';
  const ukupnoNum = Number(racun.ukupni_iznos);
  const shouldRenderBarcode =
    racun.barkod_enabled === true &&
    racun.nacin_placanja === 'ziro' &&
    iban.length > 0 &&
    ukupnoNum > 0;
  const brojPdf = formatBrojRacunaZaPdf(racun.broj_racuna);
  const reference = `HR00 ${brojPdf}`;
  const paymentBarcode = shouldRenderBarcode
    ? await buildInvoicePaymentHub3Block(
        {
          iznosEur: ukupnoNum,
          platiteljIme: kupac?.naziv ?? '',
          platiteljAdresa1: kupac?.adresa ?? '',
          platiteljAdresa2: '',
          primateljIme: profil?.naziv_obrta ?? '',
          primateljAdresa1: profil?.adresa ?? '',
          primateljAdresa2: '',
          iban,
          model: 'HR00',
          pozivNaBroj: normalizeHub3PozivNaBroj(brojPdf),
          sifraNamjene: 'OTHR',
          opis: `Račun ${brojPdf}`,
        },
        { iban, amountEur: ukupnoNum, reference },
        'api/racuni/[id]/pdf',
      )
    : null;
  const stavkeZaPdf = (stavke ?? []).map((stavka) => ({
    opis: stavka.opis,
    kolicina: Number(stavka.kolicina),
    jedinicnaCijena: Number(stavka.jedinicna_cijena),
    popust: Number(stavka.popust ?? 0),
    ukupno: Number(stavka.ukupno),
  }));
  const meduzbroj = stavkeZaPdf.reduce((sum, stavka) => sum + stavka.ukupno, 0);
  const popustRacun = Number(racun.popust_racun ?? 0);
  const popustRacunIznos = meduzbroj * (popustRacun / 100);

  const jirVal = racun.jir?.trim() ?? '';
  let fiscalQrPng: string | null = null;
  if (jirVal) {
    const fiskAt = racun.fiskalizirano_at
      ? new Date(racun.fiskalizirano_at as string)
      : new Date(`${String(racun.datum).slice(0, 10)}T12:00:00`);
    fiscalQrPng = await fiscalQrPngDataUrl(
      jirVal,
      fiskAt,
      Math.abs(ukupnoNum),
    );
  }

  const tipDok = (racun as { tip_dokumenta?: string | null }).tip_dokumenta ?? 'racun';
  const documentTitle = tipDok === 'storno' ? 'STORNO RAČUN' : 'Račun';

  const invoicePdf = InvoiceDocument({
    documentTitle,
    brojRacuna: racun.broj_racuna,
    datum: racun.datum,
    datumPlacanja: racun.datum_placanja,
    status: racun.status,
    nacinPlacanja: racun.nacin_placanja,
    tipRacuna: racun.tip_racuna,
    rokPlacanja: racun.rok_placanja,
    datumDospijeca: racun.datum_dospijeca,
    ukupniIznos: ukupnoNum,
    meduzbroj,
    popustRacun,
    popustRacunIznos,
    dostavaOpis: racun.dostava_opis,
    dostavaIznos: Number(racun.dostava_iznos ?? 0),
    napomena: racun.napomena,
    kupacNaziv: kupac?.naziv ?? '',
    kupacOib: kupac?.oib ?? null,
    kupacAdresa: kupac?.adresa ?? null,
    kupacEmail: kupac?.email ?? null,
    profil: {
      nazivObrta: profil?.naziv_obrta ?? '',
      oib: profil?.oib ?? '',
      adresa: profil?.adresa ?? null,
      ulica: profil?.ulica ?? null,
      postanskiBroj: profil?.postanski_broj ?? null,
      grad: profil?.grad ?? null,
      iban: profil?.iban ?? null,
    },
      paymentBarcode,
    stavke: stavkeZaPdf,
    zki: racun.zki ?? null,
    jir: racun.jir ?? null,
    fiscalQrPngDataUrl: fiscalQrPng,
  });

  const stream = await renderToStream(invoicePdf);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="racun-${brojZaDatoteku}.pdf"`,
    },
  });
}
