import type { MetadataRoute } from 'next';

import { CANONICAL_SITE_ORIGIN } from '@/lib/vodici-config';

export default function robots(): MetadataRoute.Robots {
  const base = CANONICAL_SITE_ORIGIN;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ''),
  };
}
