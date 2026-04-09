import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: kprUnosi } = await supabase
    .from('kpr_unosi')
    .select('datum, broj_temeljnice, opis, iznos_gotovina, iznos_bezgotovinsko, ukupno')
    .eq('user_id', user.id)
    .order('datum', { ascending: false });

  const rows = (kprUnosi ?? []).map((item) => ({
    Datum: item.datum,
    Temeljnica: item.broj_temeljnice ?? '',
    Opis: item.opis ?? '',
    Gotovina: Number(item.iznos_gotovina ?? 0),
    Bezgotovinsko: Number(item.iznos_bezgotovinsko ?? 0),
    Ukupno: Number(item.ukupno ?? 0),
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KPR');

  // TODO: Add monthly/yearly summary sheets once reporting module is introduced.
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="kpr-izvoz.xlsx"',
    },
  });
}
