import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

/** Sloj 3: kod, broj aktiviranih prijatelja, price lock status. */
export async function GET() {
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

  const [{ data: codeRow }, { data: profile }, { data: activationRows }] =
    await Promise.all([
      admin.from('user_referral_codes').select('code').eq('user_id', user.id).maybeSingle(),
      admin
        .from('profiles')
        .select('price_locked, locked_price')
        .eq('id', user.id)
        .maybeSingle(),
      admin.from('referral_activations').select('referred_id').eq('referrer_id', user.id),
    ]);

  const referredSet = new Set(
    (activationRows ?? []).map((r: { referred_id: string }) => r.referred_id),
  );
  const activatedFriendCount = referredSet.size;

  return NextResponse.json({
    code: (codeRow?.code as string | undefined) ?? null,
    activatedFriendCount,
    priceLocked: Boolean(profile?.price_locked),
    lockedPrice: profile?.locked_price != null ? Number(profile.locked_price) : null,
  });
}
