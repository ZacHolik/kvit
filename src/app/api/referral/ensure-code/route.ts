import { NextResponse } from 'next/server';

import { randomReferralCode6 } from '@/lib/referral/random-code';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

/** Sloj 3: osiguraj 6-znakovni referral kod za trenutnog korisnika. */
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

  const { data: existing } = await admin
    .from('user_referral_codes')
    .select('code')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing?.code) {
    return NextResponse.json({ code: existing.code as string });
  }

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const code = randomReferralCode6();
    const { error } = await admin.from('user_referral_codes').insert({
      user_id: user.id,
      code,
    });
    if (!error) {
      return NextResponse.json({ code });
    }
  }

  return NextResponse.json({ error: 'Could not allocate code' }, { status: 500 });
}
