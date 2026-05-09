import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const godina = new Date().getFullYear();
  const [{ data: pps }, { data: counters }] = await Promise.all([
    supabase
      .from('poslovni_prostori')
      .select('id, oznaka, adresa, radno_vrijeme, is_active, created_at')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('oznaka', { ascending: true }),
    supabase
      .from('invoice_counters')
      .select('poslovni_prostor, blagajna, godina, zadnji_broj')
      .eq('user_id', user.id)
      .eq('godina', godina),
  ]);

  return NextResponse.json({
    poslovniProstori: pps ?? [],
    invoiceCounters: counters ?? [],
    godina,
  });
}

type PostBody = {
  oznaka?: string;
  adresa?: string | null;
  radno_vrijeme?: string | null;
};

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 });
  }

  const oznaka = typeof body.oznaka === 'string' ? body.oznaka.trim() : '';
  if (!oznaka) {
    return NextResponse.json({ error: 'Oznaka je obavezna.' }, { status: 400 });
  }

  const { data: row, error } = await supabase
    .from('poslovni_prostori')
    .insert({
      user_id: user.id,
      oznaka,
      adresa: body.adresa?.trim() || null,
      radno_vrijeme: body.radno_vrijeme?.trim() || null,
      is_active: true,
    })
    .select('id, oznaka, adresa, radno_vrijeme, is_active, created_at')
    .single();

  if (error) {
    const msg = error.message.includes('unique') ? 'Oznaka već postoji.' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ poslovniProstor: row });
}
