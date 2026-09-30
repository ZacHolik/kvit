import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PARTNER_CODES, type PartnerCode } from '@/content/partnerstva';
import { PARTNER_OFFER, eur } from '@/config/pricing';

import PartnerPageView from './partner-page-view';

type PageProps = {
  params: Promise<{ kod: string }>;
};

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return PARTNER_CODES.map((kod) => ({ kod }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { kod } = await params;
  if (!PARTNER_CODES.includes(kod as PartnerCode)) {
    return {};
  }
  const description = `Tvoja publika dobiva prvu godinu Kvika za ${eur(PARTNER_OFFER.firstYear)}, a ti ${eur(PARTNER_OFFER.commissionNew)} za svakog novog kupca.`;
  return {
    title: 'Partnerstvo s Kvikom',
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    openGraph: {
      title: 'Partnerstvo s Kvikom',
      description,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'Kvik',
        },
      ],
    },
  };
}

export default async function PartnerstvaKodPage({ params }: PageProps) {
  const { kod } = await params;
  if (!PARTNER_CODES.includes(kod as PartnerCode)) {
    notFound();
  }
  return <PartnerPageView pageCode={kod} />;
}
