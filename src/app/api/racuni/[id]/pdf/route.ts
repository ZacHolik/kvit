import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

import {
  formatBrojRacunaZaPdf,
  InvoiceDocument,
} from '@/lib/pdf/invoice-document';
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
    return NextResponse.json({ error: 'Racun nije pronaden.' }, { status: 404 });
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

  const brojZaDatoteku = formatBrojRacunaZaPdf(racun.broj_racuna).replaceAll(
    '/',
    '-',
  );

  const invoicePdf = InvoiceDocument({
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
  });

  const stream = await renderToStream(invoicePdf);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="racun-${brojZaDatoteku}.pdf"`,
    },
  });
}
