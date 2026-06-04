'use client';

import { usePathname } from 'next/navigation';
import FloatingCTA from '@/components/cta/FloatingCTA';
import { detectPageVariant } from '@/lib/cta-compliance';

export default function VodiciFloatingWrapper() {
  const pathname = usePathname() ?? '';
  // /vodici/[slug] → slug = prvi segment nakon /vodici/
  const slug = pathname.replace(/^\/vodici\/?/, '').split('/')[0] ?? '';

  // /vodici landing — preskačemo (može distrahirati od izbornika vodiča)
  if (!slug) return null;

  const pageVariant = detectPageVariant(slug);
  return <FloatingCTA pageType="vodic" pageSlug={slug} pageVariant={pageVariant} />;
}
