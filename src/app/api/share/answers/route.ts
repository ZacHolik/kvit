import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

type Body = {
  question?: string;
  answer?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtjev.' }, { status: 400 });
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const answer = typeof body.answer === 'string' ? body.answer.trim() : '';
  if (!question || !answer) {
    return NextResponse.json(
      { error: 'Pitanje i odgovor su obavezni.' },
      { status: 400 },
    );
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      { error: 'Poslužitelj nije konfiguriran.' },
      { status: 500 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: row, error } = await admin
    .from('shared_answers')
    .insert({
      user_id: user?.id ?? null,
      question,
      answer,
    })
    .select('id')
    .single();

  if (error || !row?.id) {
    return NextResponse.json({ error: 'Spremanje nije uspjelo.' }, { status: 500 });
  }

  return NextResponse.json({ id: row.id });
}
