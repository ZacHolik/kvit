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
    {
      url: `${base}/alati`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${base}/alati/kalkulator-poreza`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/alati/pdv-prag`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/alati/checklista`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/alati/interni-akt`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/alati/placanje-doprinosa`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.78,
    },
    {
      url: `${base}/alati/rok-podsjetnici`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${base}/alati/izjava-poslovni-prostor`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.72,
    },
    {
      url: `${base}/alati/izjava-pozajmnica`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.72,
    },
  ];
}
