import { NextResponse } from 'next/server';

import { echoCIS } from '@/lib/fiscalization/cis';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/fiscal/echo — provjera dostupnosti CIS **demo test** (cistest Echo SOAP),
 * bez certifikata. URL: https://cistest.apis-it.hr/FiskalizacijaServiceTest
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await echoCIS();
  return NextResponse.json(result);
}
