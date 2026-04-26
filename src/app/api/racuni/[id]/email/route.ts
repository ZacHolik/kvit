import { NextResponse } from 'next/server';

import {
  formatBrojRacunaZaPdf,
  InvoiceDocument,
} from '@/lib/pdf/invoice-document';
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
        'id, broj_racuna, datum, datum_placanja, nacin_placanja, status, ukupni_iznos, napomena, kupci(naziv, oib, adresa, email)',
      )
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa, iban')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  if (error || !racun) {
    return NextResponse.json({ error: 'Račun nije pronađen.' }, { status: 404 });
  }

  const { data: stavke } = await supabase
    .from('invoice_items')
    .select('opis, kolicina, jedinicna_cijena, ukupno')
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

  const pdf = await renderPdfToBuffer(
    InvoiceDocument({
      brojRacuna: racun.broj_racuna,
      datum: racun.datum,
      datumPlacanja: racun.datum_placanja,
      status: racun.status,
      nacinPlacanja: racun.nacin_placanja,
      ukupniIznos: Number(racun.ukupni_iznos),
      napomena: racun.napomena,
      kupacNaziv: kupac?.naziv ?? '',
      kupacOib: kupac?.oib ?? null,
      kupacAdresa: kupac?.adresa ?? null,
      kupacEmail: kupac?.email ?? null,
      profil: {
        nazivObrta: profil?.naziv_obrta ?? '',
        oib: profil?.oib ?? '',
        adresa: profil?.adresa ?? null,
        iban: profil?.iban ?? null,
      },
      stavke: (stavke ?? []).map((stavka) => ({
        opis: stavka.opis,
        kolicina: Number(stavka.kolicina),
        jedinicnaCijena: Number(stavka.jedinicna_cijena),
        ukupno: Number(stavka.ukupno),
      })),
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

  return NextResponse.json({ ok: true });
}
