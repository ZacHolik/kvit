import type { Metadata } from 'next';

import { CANONICAL_SITE_ORIGIN, getSiteUrl } from '@/lib/vodici-config';

/** Dinamički OG 1200×630 (src/app/opengraph-image.tsx). Fallback dok nema per-page PNG-a. */
export const OG_IMAGE_DEFAULT = `${CANONICAL_SITE_ORIGIN}/opengraph-image`;
export const OG_IMAGE_VODIC = OG_IMAGE_DEFAULT;
export const OG_IMAGE_ALAT = OG_IMAGE_DEFAULT;

type BuildPublicMetadataOpts = {
  title: string;
  description: string;
  path: string;
  pageLabel: string;
  type?: 'article' | 'website';
  ogTitle?: string;
  imageUrl?: string;
  keywords?: string[];
};

function ogImages(alt: string, url: string) {
  return [{ url, width: 1200, height: 630, alt }];
}

export function buildPublicPageMetadata(opts: BuildPublicMetadataOpts): Metadata {
  const url = `${getSiteUrl()}${opts.path}`;
  const ogTitle = opts.ogTitle ?? opts.title;
  const imageUrl = opts.imageUrl ?? OG_IMAGE_DEFAULT;

  return {
    title: opts.title,
    description: opts.description,
    ...(opts.keywords ? { keywords: opts.keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: opts.description,
      url,
      siteName: 'Kvik',
      locale: 'hr_HR',
      type: opts.type ?? 'article',
      images: ogImages(`Kvik — ${opts.pageLabel}`, imageUrl),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: opts.description,
      images: [imageUrl],
    },
  };
}

export function buildVodicMetadata(
  slug: string,
  title: string,
  description: string,
  ogTitle?: string,
): Metadata {
  return buildPublicPageMetadata({
    title,
    description,
    path: `/vodici/${slug}`,
    pageLabel: title,
    type: 'article',
    ogTitle: ogTitle ?? `${title} | Kvik`,
    imageUrl: OG_IMAGE_VODIC,
  });
}

export function buildAlatMetadata(
  slug: string,
  title: string,
  description: string,
  opts?: { ogTitle?: string; keywords?: string[]; type?: 'article' | 'website' },
): Metadata {
  return buildPublicPageMetadata({
    title,
    description,
    path: `/alati/${slug}`,
    pageLabel: title,
    type: opts?.type ?? 'website',
    ogTitle: opts?.ogTitle ?? title,
    imageUrl: OG_IMAGE_ALAT,
    keywords: opts?.keywords,
  });
}
