import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ppFilter = new URL(request.url).searchParams.get('poslovni_prostor_id')?.trim();

  let ppQuery = supabase
    .from('poslovni_prostori')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (ppFilter) {
    ppQuery = ppQuery.eq('id', ppFilter);
  }

  const { data: ppRows, error: ppErr } = await ppQuery;
  if (ppErr) {
    return NextResponse.json({ error: ppErr.message }, { status: 500 });
  }

  const ppIds = (ppRows ?? []).map((r) => r.id as string);
  if (ppIds.length === 0) {
    return NextResponse.json({ naplatniUredaji: [] });
  }

  const { data, error } = await supabase
    .from('naplatni_uredaji')
    .select('id, poslovni_prostor_id, oznaka, is_active, created_at')
    .in('poslovni_prostor_id', ppIds)
    .eq('is_active', true)
    .order('oznaka', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ naplatniUredaji: data ?? [] });
}

type PostBody = {
  oznaka?: string;
  poslovni_prostor_id?: string;
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
  const ppId = typeof body.poslovni_prostor_id === 'string' ? body.poslovni_prostor_id.trim() : '';
  if (!oznaka || !ppId) {
    return NextResponse.json(
      { error: 'oznaka i poslovni_prostor_id su obavezni.' },
      { status: 400 },
    );
  }

  const { data: pp, error: ppErr } = await supabase
    .from('poslovni_prostori')
    .select('id')
    .eq('id', ppId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (ppErr || !pp) {
    return NextResponse.json({ error: 'Poslovni prostor nije pronađen.' }, { status: 404 });
  }

  const { data: row, error } = await supabase
    .from('naplatni_uredaji')
    .insert({
      poslovni_prostor_id: ppId,
      oznaka,
      is_active: true,
    })
    .select('id, poslovni_prostor_id, oznaka, is_active, created_at')
    .single();

  if (error) {
    const msg = error.message.includes('unique') ? 'Oznaka već postoji na tom PP-u.' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ naplatniUredaj: row });
}
