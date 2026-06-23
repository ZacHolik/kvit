import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import Script from 'next/script';

import MetaPixel from '@/components/MetaPixel';
import { getSiteUrl } from '@/lib/vodici-config';

import './globals.css';

const syne = Syne({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Kvik – Paušalni obrt bez glavobolje',
  description:
    'Jedina aplikacija koja te vodi korak po korak kroz sve obveze paušalnog obrta. Bez papirologije, bez stresa, bez kazni.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Kvik',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  verification: {
    google: 'bgft4wJhAEgJDKCp-4kE8fsazAiwsgRe6OSmTpy0wvI',
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
      <body
        suppressHydrationWarning
        className={`${syne.variable} ${dmSans.variable} antialiased`}
      >
        {children}
        {/* Google tag (gtag.js) */}
        <Script
          src='https://www.googletagmanager.com/gtag/js?id=G-1TLKHLXQBW'
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1TLKHLXQBW');
          `}
        </Script>
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
