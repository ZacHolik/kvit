import { NextResponse } from 'next/server';

import { findUserByEmail, sendPasswordSetupEmail } from '@/lib/auth-emails';
import { checkResendSetupRateLimit } from '@/lib/resend-setup-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  if (!checkResendSetupRateLimit(email)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  const user = await findUserByEmail(admin, email);
  if (!user) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (user.last_sign_in_at) {
    return NextResponse.json({ message: 'already_set' });
  }

  await sendPasswordSetupEmail(admin, email, user.id, true);
  return NextResponse.json({ message: 'sent' });
}
