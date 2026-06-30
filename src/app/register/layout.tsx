import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kvik – Potpuno knjigovodstvo za paušaliste',
  description:
    'Kvik: potpuno knjigovodstvo za paušaliste. Na tvome mobitelu. S tobom uvijek i svugdje.',
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
