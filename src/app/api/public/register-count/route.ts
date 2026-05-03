import { NextResponse } from 'next/server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

/** Javni broj registriranih korisnika (profila) za early adopter progress na LP. */
export async function GET() {
  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ count: 0 });
  }

  const { count, error } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    return NextResponse.json({ count: 0 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
