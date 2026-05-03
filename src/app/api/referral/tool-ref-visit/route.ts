import { NextResponse, type NextRequest } from 'next/server';

import { getClientIpFromRequest } from '@/lib/client-ip';
import { hashVisitorIpForReferral } from '@/lib/referral/hash-ip';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const CODE_RE = /^[a-z0-9]{6}$/;

type Body = {
  referralCode?: string;
};

/** Sloj 2: zabilježi posjet alata s ?ref= (deduplikacija po kodu + hash IP-a). */
export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const code =
    typeof body.referralCode === 'string' ? body.referralCode.trim().toLowerCase() : '';
  if (!CODE_RE.test(code)) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const { data: owner } = await admin
    .from('user_referral_codes')
    .select('user_id')
    .eq('code', code)
    .maybeSingle();

  const referrerId = owner?.user_id as string | undefined;
  if (!referrerId) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const ip = getClientIpFromRequest(request);
  const visitorIpHash = hashVisitorIpForReferral(ip);

  const { error } = await admin.from('referral_visits').insert({
    referrer_user_id: referrerId,
    referral_code: code,
    visitor_ip_hash: visitorIpHash,
  });

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
