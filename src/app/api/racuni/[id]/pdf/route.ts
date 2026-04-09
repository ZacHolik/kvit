import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

import { InvoiceDocument } from '@/lib/pdf/invoice-document';
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

  const { data: racun, error } = await supabase
    .from('racuni')
    .select(
      'id, broj_racuna, datum, datum_placanja, nacin_placanja, status, ukupni_iznos, napomena, kupci(naziv, oib, adresa)',
    )
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !racun) {
    return NextResponse.json({ error: 'Racun nije pronaden.' }, { status: 404 });
  }

  const { data: stavke } = await supabase
    .from('stavke_racuna')
    .select('opis, kolicina, jedinicna_cijena, ukupno')
    .eq('racun_id', racun.id);

  const invoicePdf = InvoiceDocument({
    brojRacuna: racun.broj_racuna,
    datum: racun.datum,
    status: racun.status,
    nacinPlacanja: racun.nacin_placanja,
    ukupniIznos: Number(racun.ukupni_iznos),
    napomena: racun.napomena,
    kupacNaziv: (racun.kupci as { naziv?: string } | null)?.naziv ?? '-',
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
      'Content-Disposition': `inline; filename="racun-${racun.broj_racuna}.pdf"`,
    },
  });
}
