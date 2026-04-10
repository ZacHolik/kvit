import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';
import { getKprExportYear, kprDatumRangeZaGodinu } from '@/lib/kpr-export';
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
  const godina = getKprExportYear(searchParams);
  const { od, kraj } = kprDatumRangeZaGodinu(godina);

  const [{ data: kprUnosi }, { data: profil }] = await Promise.all([
    supabase
      .from('kpr_unosi')
      .select(
        'datum, broj_temeljnice, opis, iznos_gotovina, iznos_bezgotovinsko, ukupno',
      )
      .eq('user_id', user.id)
      .gte('datum', od)
      .lte('datum', kraj)
      .order('datum', { ascending: false }),
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  const metaRows: string[][] = [
    ['Naziv obrta', profil?.naziv_obrta ?? ''],
    ['OIB', profil?.oib ?? ''],
    ['Adresa', profil?.adresa ?? ''],
    ['Godina knjige', String(godina)],
    [],
  ];

  const tableHeader = [
    ['Datum', 'Temeljnica', 'Opis', 'Gotovina', 'Bezgotovinsko', 'Ukupno'],
  ];

  const dataRows = (kprUnosi ?? []).map((item) => [
    formatDatumHr(item.datum),
    item.broj_temeljnice ?? '',
    item.opis ?? '',
    formatIznosEurHr(Number(item.iznos_gotovina ?? 0)),
    formatIznosEurHr(Number(item.iznos_bezgotovinsko ?? 0)),
    formatIznosEurHr(Number(item.ukupno ?? 0)),
  ]);

  const aoa = [...metaRows, ...tableHeader, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  worksheet['!cols'] = [
    { wch: 14 },
    { wch: 20 },
    { wch: 52 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KPR');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="kpr-${godina}.xlsx"`,
    },
  });
}
