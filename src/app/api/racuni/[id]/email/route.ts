import { NextResponse } from 'next/server';

import { buildHub30EurCode } from '@/lib/alati/hub3-eur';
import {
  formatBrojRacunaZaPdf,
  InvoiceDocument,
} from '@/lib/pdf/invoice-document';
import { generatePdf417Matrix } from '@/lib/pdf/pdf417-matrix';
import { renderPdfToBuffer } from '@/lib/pdf/render-pdf-buffer';
import { createClient } from '@/lib/supabase/server';

type EmailPayload = {
  to?: string;
  subject?: string;
  message?: string;
};

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const body = (await request.json().catch(() => ({}))) as EmailPayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: 'Nedostaje RESEND_API_KEY u okruženju.' },
      { status: 500 },
    );
  }

  const [{ data: racun, error }, { data: profil }] = await Promise.all([
    supabase
      .from('racuni')
      .select(
        'id, broj_racuna, datum, datum_placanja, nacin_placanja, status, tip_racuna, popust_racun, rok_placanja, datum_dospijeca, dostava_iznos, dostava_opis, ukupni_iznos, napomena, barkod_enabled, kupci(naziv, oib, adresa, email)',
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
    return NextResponse.json({ error: 'Račun nije pronađen.' }, { status: 404 });
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

  const to = body.to?.trim() || kupac?.email?.trim();
  if (!to) {
    return NextResponse.json({ error: 'Email primatelja je obavezan.' }, { status: 400 });
  }

  const iban = profil?.iban?.replace(/\s/g, '').trim() ?? '';
  const shouldRenderBarcode =
    racun.barkod_enabled === true &&
    racun.nacin_placanja === 'ziro' &&
    iban.length > 0;
  const reference = `HR00 ${formatBrojRacunaZaPdf(racun.broj_racuna)}`;
  const barcodeMatrix = shouldRenderBarcode
    ? generatePdf417Matrix(
        buildHub30EurCode({
          iznosEur: Number(racun.ukupni_iznos),
          platiteljIme: kupac?.naziv ?? '',
          platiteljAdresa1: kupac?.adresa ?? '',
          platiteljAdresa2: '',
          primateljIme: profil?.naziv_obrta ?? '',
          primateljAdresa1: profil?.adresa ?? '',
          primateljAdresa2: '',
          iban,
          model: 'HR00',
          pozivNaBroj: formatBrojRacunaZaPdf(racun.broj_racuna),
          sifraNamjene: 'OTHR',
          opis: `Račun ${formatBrojRacunaZaPdf(racun.broj_racuna)}`,
        }),
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

  const pdf = await renderPdfToBuffer(
    InvoiceDocument({
      brojRacuna: racun.broj_racuna,
      datum: racun.datum,
      datumPlacanja: racun.datum_placanja,
      status: racun.status,
      nacinPlacanja: racun.nacin_placanja,
      tipRacuna: racun.tip_racuna,
      rokPlacanja: racun.rok_placanja,
      datumDospijeca: racun.datum_dospijeca,
      ukupniIznos: Number(racun.ukupni_iznos),
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
      paymentBarcode: barcodeMatrix
        ? {
            matrix: barcodeMatrix.rows,
            numCols: barcodeMatrix.numCols,
            numRows: barcodeMatrix.numRows,
            iban,
            amountEur: Number(racun.ukupni_iznos),
            reference,
          }
        : null,
      stavke: stavkeZaPdf,
    }),
  );

  const filename = `racun-${formatBrojRacunaZaPdf(racun.broj_racuna).replaceAll('/', '-')}.pdf`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Kvit <noreply@kvit.online>',
      to,
      subject:
        body.subject?.trim() ||
        `Račun broj ${racun.broj_racuna} - ${profil?.naziv_obrta ?? 'Kvit'}`,
      text: body.message?.trim() || 'U prilogu se nalazi vaš račun.',
      attachments: [
        {
          filename,
          content: pdf.toString('base64'),
        },
      ],
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    return NextResponse.json(
      { error: payload.message || 'Slanje emaila nije uspjelo.' },
      { status: 502 },
    );
  }

  await supabase
    .from('racuni')
    .update({
      email_poslano_at: new Date().toISOString(),
      email_poslano_na: to,
    })
    .eq('id', racun.id)
    .eq('user_id', user.id);

  return NextResponse.json({ ok: true });
}
