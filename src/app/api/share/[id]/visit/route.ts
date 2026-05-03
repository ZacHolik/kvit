import { NextResponse } from 'next/server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Neispravan ID.' }, { status: 400 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: 'Poslužitelj nije konfiguriran.' }, { status: 500 });
  }

  const { data: current, error: readError } = await admin
    .from('shared_answers')
    .select('visit_count')
    .eq('id', id)
    .maybeSingle();

  if (readError || !current) {
    return NextResponse.json({ error: 'Nije pronađeno.' }, { status: 404 });
  }

  const nextCount = Number(current.visit_count ?? 0) + 1;
  const { error: updateError } = await admin
    .from('shared_answers')
    .update({ visit_count: nextCount })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: 'Ažuriranje nije uspjelo.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
