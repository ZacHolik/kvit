import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { getClientIpFromRequest } from '@/lib/client-ip';
import { recordRegistrationAttempt } from '@/lib/registration-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RegisterBody = {
  email?: string;
  password?: string;
  emailRedirectTo?: string;
  /** Honeypot — must stay empty (bots often fill hidden fields). */
  kvit_hp_confirm?: string;
  turnstileToken?: string;
  /** Sloj 1: UUID dijeljenog AI odgovora s /share/[uuid] CTA. */
  shareAnswerId?: string;
  /** Sloj 3: referral kod s /r/[code] ili ?ref=. */
  referralFriendCode?: string;
  /** Sloj 2: nagrada PRO tjedan refereru kad se prijatelj registrira s value gate linka. */
  registrationSource?: string;
};

const REF_CODE_RE = /^[a-z0-9]{6}$/;

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

  const shareAnswerIdRaw =
    typeof body.shareAnswerId === 'string' ? body.shareAnswerId.trim() : '';
  const shareAnswerId =
    shareAnswerIdRaw && UUID_RE.test(shareAnswerIdRaw) ? shareAnswerIdRaw : '';

  const referralFriendCodeRaw =
    typeof body.referralFriendCode === 'string'
      ? body.referralFriendCode.trim().toLowerCase()
      : '';
  const referralFriendCode =
    referralFriendCodeRaw && REF_CODE_RE.test(referralFriendCodeRaw)
      ? referralFriendCodeRaw
      : '';

  const registrationSource =
    typeof body.registrationSource === 'string'
      ? body.registrationSource.trim().toLowerCase()
      : '';

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: emailRedirectTo ? { emailRedirectTo } : undefined,
  });

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }

  const newUserId = signUpData.user?.id;
  if (admin && newUserId) {
    if (shareAnswerId) {
      const { error: refError } = await admin.from('referrals').insert({
        referrer_share_id: shareAnswerId,
        referred_user_id: newUserId,
      });
      if (!refError) {
        const { data: shareRow } = await admin
          .from('shared_answers')
          .select('signup_count')
          .eq('id', shareAnswerId)
          .maybeSingle();
        const prev = Number(shareRow?.signup_count ?? 0);
        await admin
          .from('shared_answers')
          .update({ signup_count: prev + 1 })
          .eq('id', shareAnswerId);
      }
    } else if (referralFriendCode) {
      const { data: codeOwner } = await admin
        .from('user_referral_codes')
        .select('user_id')
        .eq('code', referralFriendCode)
        .maybeSingle();
      const ownerId = codeOwner?.user_id as string | undefined;
      if (ownerId && ownerId !== newUserId) {
        await admin.from('referrals').insert({
          referrer_user_id: ownerId,
          referred_user_id: newUserId,
        });
      }
    }
  }

  if (
    admin &&
    newUserId &&
    registrationSource === 'tool_gate' &&
    referralFriendCode
  ) {
    const { data: owner } = await admin
      .from('user_referral_codes')
      .select('user_id')
      .eq('code', referralFriendCode)
      .maybeSingle();
    const rid = owner?.user_id as string | undefined;
    if (rid && rid !== newUserId) {
      const { data: proProf } = await admin
        .from('profiles')
        .select('pro_expires_at')
        .eq('id', rid)
        .maybeSingle();
      const nowMs = Date.now();
      const cur = proProf?.pro_expires_at
        ? new Date(proProf.pro_expires_at as string).getTime()
        : 0;
      const base = Math.max(nowMs, cur);
      const newExp = new Date(base + 7 * 86400000).toISOString();
      await admin.from('profiles').update({ pro_expires_at: newExp }).eq('id', rid);
    }
  }

  return NextResponse.json({ ok: true });
}
