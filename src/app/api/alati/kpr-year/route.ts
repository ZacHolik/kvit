import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/**
 * Zbroj KPR ukupno za tekuću kalendarsku godinu (YTD).
 * Za ulogirane korisnike alata (isti session kao aplikacija).
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Nisi prijavljen.' }, { status: 401 });
  }

  const year = new Date().getFullYear();
  const yearStart = `${year}-01-01`;

  const { data: rows, error } = await supabase
    .from('kpr_unosi')
    .select('ukupno')
    .eq('user_id', user.id)
    .gte('datum', yearStart);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const total = (rows ?? []).reduce(
    (sum, r) => sum + Number(r.ukupno ?? 0),
    0,
  );

  return NextResponse.json({ year, total });
}
