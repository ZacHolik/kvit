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

  const [{ data: ponuda, error }, { data: profil }] = await Promise.all([
    supabase
      .from('ponude')
      .select(
        'id, broj_ponude, datum, datum_valjanosti, kupac_naziv, kupac_oib, kupac_adresa, kupac_email, status, napomena, ukupno',
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

  if (error || !ponuda) {
    return NextResponse.json({ error: 'Ponuda nije pronađena.' }, { status: 404 });
  }

  const { data: stavke } = await supabase
    .from('ponuda_items')
    .select('opis, kolicina, jedinicna_cijena, ukupno')
    .eq('ponuda_id', ponuda.id);

  const stream = await renderToStream(
    InvoiceDocument({
      documentTitle: 'Ponuda',
      brojRacuna: ponuda.broj_ponude,
      datum: ponuda.datum,
      datumPlacanja: ponuda.datum_valjanosti,
      status: ponuda.status,
      nacinPlacanja: null,
      ukupniIznos: Number(ponuda.ukupno),
      napomena: ponuda.napomena,
      kupacNaziv: ponuda.kupac_naziv,
      kupacOib: ponuda.kupac_oib,
      kupacAdresa: ponuda.kupac_adresa,
      kupacEmail: ponuda.kupac_email,
      profil: {
        nazivObrta: profil?.naziv_obrta ?? '',
        oib: profil?.oib ?? '',
        adresa: profil?.adresa ?? null,
        ulica: profil?.ulica ?? null,
        postanskiBroj: profil?.postanski_broj ?? null,
        grad: profil?.grad ?? null,
        iban: profil?.iban ?? null,
      },
      footerText: 'Ponuda nije fiskalizirani račun. Iznosi su informativni do prihvaćanja ponude.',
      stavke: (stavke ?? []).map((stavka) => ({
        opis: stavka.opis,
        kolicina: Number(stavka.kolicina),
        jedinicnaCijena: Number(stavka.jedinicna_cijena),
        ukupno: Number(stavka.ukupno),
      })),
    }),
  );

  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="ponuda-${ponuda.broj_ponude}.pdf"`,
    },
  });
}
