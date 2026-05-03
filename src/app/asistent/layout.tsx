import type { ReactNode } from 'react';

import { DashboardShell } from '@/app/(app)/dashboard-shell';
import { createClient } from '@/lib/supabase/server';

/**
 * Gosti vide asistenta bez navigacije; ulogirani korisnici zadržavaju isti DashboardShell
 * kao ostale (app) rute.
 */
export default async function AsistentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return <DashboardShell>{children}</DashboardShell>;
  }

  return <>{children}</>;
}
