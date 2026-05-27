/**
 * Webhook-only: kreira interni račun za Stripe pretplatu i generira PDF buffer.
 * Service role client — nema auth.uid() za bump_invoice_counter, koristi fiksni broj_racuna.
 */

import { renderToBuffer } from '@react-pdf/renderer';

import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import {
  formatBrojRacunaZaPdf,
  InvoiceDocument,
} from '@/lib/pdf/invoice-document';
import { normalizeHub3PozivNaBroj } from '@/lib/alati/hub3-eur';
import { buildInvoicePaymentHub3Block } from '@/lib/pdf/build-invoice-payment-hub3';
import { fiscalQrPngDataUrl } from '@/lib/fiscalization/fiscal-qr';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

type Admin = NonNullable<ReturnType<typeof createServiceRoleClient>>;

/** From adresa za pretplatničke / billing emailove (Resend). */
export function billingResendFrom(): string {
  return (
    process.env.RESEND_FROM_BILLING ?? 'Kvik Naplata <pretplata@kvik.hr>'
  );
}

export type CreateBillingRacunParams = {
  userId: string;
  stripeInvoiceId: string;
  amountEur: number;
  interval: 'month' | 'year' | null;
  /** ISO datum računa (YYYY-MM-DD) */
  datum: string;
};

function planOpis(interval: 'month' | 'year' | null): string {
  if (interval === 'year') {
    return 'Kvik Paušalist — Godišnje';
  }
  if (interval === 'month') {
    return 'Kvik Paušalist — Mjesečno';
  }
  return 'Kvik Paušalist — Probno';
}

/**
 * Kreira kupca (Kvik), račun i stavku; KPR za plaćenu karticom/bezgotovinsko.
 * R1 ako postoji KVIK_BILLING_OIB, inače R2.
 */
export async function createBillingRacunForStripe(
  admin: Admin,
  p: CreateBillingRacunParams,
): Promise<string | null> {
  if (p.amountEur <= 0) {
    return null;
  }

  const kvikOib = process.env.KVIK_BILLING_OIB?.trim();
  const kvikName = process.env.KVIK_BILLING_NAZIV?.trim() ?? 'Kvik';
  const kvikAdresa = process.env.KVIK_BILLING_ADRESA?.trim() ?? '';
  const tipRacuna = kvikOib ? 'R1' : 'R2';

  const brojRacuna = `SUB/${p.stripeInvoiceId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  const { data: existing } = await admin
    .from('racuni')
    .select('id')
    .eq('user_id', p.userId)
    .eq('broj_racuna', brojRacuna)
    .maybeSingle();
  if (existing?.id) {
    return existing.id as string;
  }

  const kupacPayload = {
    user_id: p.userId,
    naziv: kvikName,
    oib: tipRacuna === 'R1' ? kvikOib : null,
    adresa: kvikAdresa || null,
    email: null as string | null,
  };

  const { data: kupac, error: kupErr } = await admin
    .from('kupci')
    .insert(kupacPayload)
    .select('id')
    .single();
  if (kupErr || !kupac) {
    console.error('billing racun: kupac insert', kupErr);
    return null;
  }

  const opis = planOpis(p.interval);
  const jedinicnaCijena = p.amountEur;
  const kolicina = 1;
  const popust = 0;
  const ukupno = jedinicnaCijena * kolicina;

  const { data: racun, error: rErr } = await admin
    .from('racuni')
    .insert({
      user_id: p.userId,
      kupac_id: kupac.id,
      broj_racuna: brojRacuna,
      datum: p.datum,
      datum_placanja: p.datum,
      nacin_placanja: 'kartica',
      ukupni_iznos: ukupno,
      status: 'placeno',
      tip_racuna: tipRacuna,
      popust_racun: popust,
      rok_placanja: 'Plaćeno',
      datum_dospijeca: null,
      dostava_iznos: 0,
      dostava_opis: null,
      napomena: `Stripe pretplata · ${p.stripeInvoiceId}`,
      recurring: false,
      recurring_interval: null,
      barkod_enabled: false,
      dodaj_barkod_placanja: false,
    })
    .select('id')
    .single();

  if (rErr || !racun) {
    console.error('billing racun: racun insert', rErr);
    return null;
  }

  const racunId = racun.id as string;

  const { error: stErr } = await admin.from('invoice_items').insert({
    racun_id: racunId,
    opis,
    kolicina,
    jedinicna_cijena: jedinicnaCijena,
    popust,
    ukupno,
  });
  if (stErr) {
    console.error('billing racun: stavke', stErr);
    return racunId;
  }

  await admin.from('kpr_unosi').insert({
    user_id: p.userId,
    racun_id: racunId,
    datum: p.datum,
    broj_temeljnice: brojRacuna,
    opis: opisAutomatskogKprUnosaZaRacun(brojRacuna),
    iznos_gotovina: 0,
    iznos_bezgotovinsko: ukupno,
    ukupno,
  });

  return racunId;
}

/** Isti layout kao GET /api/racuni/[id]/pdf — za Resend privitak. */
export async function renderRacunPdfBuffer(
  admin: Admin,
  racunId: string,
  userId: string,
): Promise<Buffer | null> {
  try {
    const [{ data: racun, error }, { data: profil }] = await Promise.all([
      admin
        .from('racuni')
        .select(
          'id, broj_racuna, datum, datum_placanja, nacin_placanja, status, tip_racuna, tip_dokumenta, popust_racun, rok_placanja, datum_dospijeca, dostava_iznos, dostava_opis, ukupni_iznos, napomena, barkod_enabled, zki, jir, fiskalizirano_at, kupci(naziv, oib, adresa, email)',
        )
        .eq('id', racunId)
        .eq('user_id', userId)
        .single(),
      admin
        .from('profiles')
        .select('naziv_obrta, oib, adresa, ulica, postanski_broj, grad, iban')
        .eq('id', userId)
        .maybeSingle(),
    ]);

    if (error || !racun) {
      return null;
    }

    const { data: stavke } = await admin
      .from('invoice_items')
      .select('opis, kolicina, jedinicna_cijena, popust, ukupno')
      .eq('racun_id', racun.id);

    const kupac = racun.kupci as {
      naziv?: string | null;
      oib?: string | null;
      adresa?: string | null;
      email?: string | null;
    } | null;

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
          'lib/stripe/billing-racun-pdf',
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

    const buf = await renderToBuffer(invoicePdf);
    return buf;
  } catch (e) {
    console.error('renderRacunPdfBuffer', e);
    return null;
  }
}
