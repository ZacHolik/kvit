import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import './globals.css';

const syne = Syne({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Kvit – Paušalni obrt bez glavobolje',
  description:
    'Jedina aplikacija koja te vodi korak po korak kroz sve obveze paušalnog obrta. Bez papirologije, bez stresa, bez kazni.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Kvit',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#0d9488',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='hr'>
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
