import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: nu, error: readErr } = await supabase
    .from('naplatni_uredaji')
    .select('id, poslovni_prostor_id')
    .eq('id', params.id)
    .maybeSingle();

  if (readErr || !nu) {
    return NextResponse.json({ error: 'Nije pronađeno.' }, { status: 404 });
  }

  const { data: ppOwn } = await supabase
    .from('poslovni_prostori')
    .select('user_id')
    .eq('id', nu.poslovni_prostor_id as string)
    .maybeSingle();

  if (!ppOwn || (ppOwn as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Nije pronađeno.' }, { status: 404 });
  }

  let body: { oznaka?: string };
  try {
    body = (await request.json()) as { oznaka?: string };
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 });
  }

  const oznaka = typeof body.oznaka === 'string' ? body.oznaka.trim() : '';
  if (!oznaka) {
    return NextResponse.json({ error: 'Oznaka je obavezna.' }, { status: 400 });
  }

  const { data: row, error } = await supabase
    .from('naplatni_uredaji')
    .update({ oznaka })
    .eq('id', params.id)
    .select('id, poslovni_prostor_id, oznaka, is_active, created_at')
    .single();

  if (error) {
    const msg = error.message.includes('unique') ? 'Oznaka već postoji na tom PP-u.' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ naplatniUredaj: row });
}

export async function DELETE(
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

  const { data: nu, error: readErr } = await supabase
    .from('naplatni_uredaji')
    .select('id, oznaka, poslovni_prostor_id')
    .eq('id', params.id)
    .maybeSingle();

  if (readErr || !nu) {
    return NextResponse.json({ error: 'Nije pronađeno.' }, { status: 404 });
  }

  const { data: ppRow } = await supabase
    .from('poslovni_prostori')
    .select('user_id, oznaka')
    .eq('id', nu.poslovni_prostor_id as string)
    .maybeSingle();

  const pp = ppRow as { user_id: string; oznaka: string } | null;
  if (!pp || pp.user_id !== user.id) {
    return NextResponse.json({ error: 'Nije pronađeno.' }, { status: 404 });
  }

  const ppOznaka = String(pp.oznaka).trim();
  const nuOznaka = String(nu.oznaka).trim();
  const pattern = `%/${ppOznaka}/${nuOznaka}%`;
  const { count, error: cntErr } = await supabase
    .from('racuni')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .ilike('broj_racuna', pattern);

  if (cntErr) {
    return NextResponse.json({ error: cntErr.message }, { status: 500 });
  }
  if (count && count > 0) {
    return NextResponse.json(
      { error: 'Ne može se deaktivirati: postoje računi s ovim naplatnim uređajem.' },
      { status: 409 },
    );
  }

  const { error } = await supabase
    .from('naplatni_uredaji')
    .update({ is_active: false })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
