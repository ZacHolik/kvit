import type { MetadataRoute } from 'next';

import { getSiteUrl, VODICI_ENTRIES } from '@/lib/vodici-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/vodici`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...VODICI_ENTRIES.map((e) => ({
      url: `${base}/vodici/${e.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
