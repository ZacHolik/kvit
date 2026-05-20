import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paušalist PRO — Uskoro | Kvik',
  description:
    'Trenutno razvijamo PRO plan za paušalne obrte. Ostavite email za obavijest kad bude dostupan.',
  alternates: { canonical: 'https://kvik.online/pro-uskoro' },
};

export default function ProUskoroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
