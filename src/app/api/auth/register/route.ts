import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { getClientIpFromRequest } from '@/lib/client-ip';
import { recordRegistrationAttempt } from '@/lib/registration-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type RegisterBody = {
  email?: string;
  password?: string;
  emailRedirectTo?: string;
  /** Honeypot — must stay empty (bots often fill hidden fields). */
  kvit_hp_confirm?: string;
  turnstileToken?: string;
};

async function verifyTurnstile(token: string, remoteIp: string | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return false;
  }
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp && remoteIp !== 'unknown') {
    body.set('remoteip', remoteIp);
  }
  const res = await fetch(TURNSTILE_VERIFY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    return false;
  }
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export async function POST(request: NextRequest) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtjev.' }, { status: 400 });
  }

  const hp = typeof body.kvit_hp_confirm === 'string' ? body.kvit_hp_confirm.trim() : '';
  if (hp.length > 0) {
    return NextResponse.json(
      { error: 'Registracija nije uspjela. Pokušaj ponovno.' },
      { status: 400 },
    );
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (siteKey) {
    const token =
      typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : '';
    if (!token) {
      return NextResponse.json(
        { error: 'Potvrdi da nisi robot (Turnstile).' },
        { status: 400 },
      );
    }
    const ip = getClientIpFromRequest(request);
    const ok = await verifyTurnstile(token, ip);
    if (!ok) {
      return NextResponse.json(
        { error: 'Provjera Turnstile nije uspjela. Osvježi stranicu i pokušaj ponovno.' },
        { status: 400 },
      );
    }
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const emailRedirectTo =
    typeof body.emailRedirectTo === 'string' ? body.emailRedirectTo.trim() : '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email i lozinka su obavezni.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Lozinka mora imati najmanje 8 znakova.' },
      { status: 400 },
    );
  }

  const admin = createServiceRoleClient();
  const ip = getClientIpFromRequest(request);

  if (admin) {
    const recorded = await recordRegistrationAttempt(admin, ip);
    if (!recorded) {
      return NextResponse.json(
        { error: 'Registracija trenutno nije dostupna. Pokušaj kasnije.' },
        { status: 503 },
      );
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Konfiguracija poslužitelja je nepotpuna.' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: emailRedirectTo ? { emailRedirectTo } : undefined,
  });

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
