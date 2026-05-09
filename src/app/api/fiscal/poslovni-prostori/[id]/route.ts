import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

function escapeLikeFragment(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

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

  const { data: existing, error: readErr } = await supabase
    .from('poslovni_prostori')
    .select('id, oznaka')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (readErr || !existing) {
    return NextResponse.json({ error: 'Nije pronađeno.' }, { status: 404 });
  }

  let body: { oznaka?: string; adresa?: string | null; radno_vrijeme?: string | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.oznaka === 'string') {
    const o = body.oznaka.trim();
    if (!o) {
      return NextResponse.json({ error: 'Oznaka ne smije biti prazna.' }, { status: 400 });
    }
    patch.oznaka = o;
  }
  if (body.adresa !== undefined) {
    patch.adresa = body.adresa?.trim() || null;
  }
  if (body.radno_vrijeme !== undefined) {
    patch.radno_vrijeme = body.radno_vrijeme?.trim() || null;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nema polja za ažuriranje.' }, { status: 400 });
  }

  const { data: row, error } = await supabase
    .from('poslovni_prostori')
    .update(patch)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select('id, oznaka, adresa, radno_vrijeme, is_active, created_at')
    .single();

  if (error) {
    const msg = error.message.includes('unique') ? 'Oznaka već postoji.' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ poslovniProstor: row });
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

  const { data: pp, error: readErr } = await supabase
    .from('poslovni_prostori')
    .select('id, oznaka')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (readErr || !pp) {
    return NextResponse.json({ error: 'Nije pronađeno.' }, { status: 404 });
  }

  const oznaka = String(pp.oznaka).trim();
  const pattern = `%/${escapeLikeFragment(oznaka)}/%`;
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
      { error: 'Ne može se deaktivirati: postoje računi s ovim poslovnim prostorom.' },
      { status: 409 },
    );
  }

  const { error } = await supabase
    .from('poslovni_prostori')
    .update({ is_active: false })
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
