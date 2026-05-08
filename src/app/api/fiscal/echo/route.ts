import { NextResponse } from 'next/server';

import { echoCIS } from '@/lib/fiscalization/cis';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/fiscal/echo — provjera dostupnosti CIS-a (Echo, bez certifikata).
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'test';
  const result = await echoCIS(mode);
  return NextResponse.json(result);
}
