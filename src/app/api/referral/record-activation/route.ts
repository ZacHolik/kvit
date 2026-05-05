import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const TYPES = new Set(['ai_question', 'calculator', 'posd_preview']);

type Body = {
  activationType?: string;
};

/** Sloj 3: zabilježi aktivaciju učitanog prijatelja (za zaključavanje cijene). */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const activationType =
    typeof body.activationType === 'string' ? body.activationType.trim() : '';
  if (!TYPES.has(activationType)) {
    return NextResponse.json({ error: 'Invalid activation type' }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const { data: refRow } = await admin
    .from('referrals')
    .select('referrer_user_id')
    .eq('referred_user_id', user.id)
    .not('referrer_user_id', 'is', null)
    .maybeSingle();

  const referrerId = refRow?.referrer_user_id as string | undefined;
  if (!referrerId) {
    return NextResponse.json({ ok: true, recorded: false });
  }

  const { error: insErr } = await admin.from('referral_activations').insert({
    referrer_id: referrerId,
    referred_id: user.id,
    activation_type: activationType,
  });

  if (insErr && insErr.code !== '23505') {
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }

  const { data: actRows } = await admin
    .from('referral_activations')
    .select('referred_id')
    .eq('referrer_id', referrerId);

  const distinct = new Set(
    (actRows ?? []).map((r: { referred_id: string }) => r.referred_id),
  ).size;

  if (distinct >= 3) {
    await admin
      .from('profiles')
      .update({ price_locked: true, locked_price: 5.6 })
      .eq('id', referrerId);
  }

  return NextResponse.json({ ok: true, recorded: true });
}
