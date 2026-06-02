'use client';

import { usePathname } from 'next/navigation';
import FloatingCTA from '@/components/cta/FloatingCTA';

export default function AlatiFloatingWrapper() {
  const pathname = usePathname() ?? '';
  // /alati/[slug] → slug = prvi segment nakon /alati/
  const slug = pathname.replace(/^\/alati\/?/, '').split('/')[0] ?? '';

  // /alati landing — preskačemo FloatingCTA (može distrahirati od izbornika alata)
  if (!slug) return null;

  // Alati uvijek tretiraju FloatingCTA kao 'compliance' → FLOATING-A
  return <FloatingCTA pageType="alat" pageSlug={slug} pageVariant="compliance" />;
}
