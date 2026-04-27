import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

import './globals.css';

const META_PIXEL_ID = '110959382772503';

const metaPixelInline = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`.trim();

const metaPixelNoscript = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" alt="" />`;

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
    google: '2zDiYQ95uANtsRiQteyTkZ8Pp-qmoAD43bylIbGd15w',
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
        <Script
          id='meta-pixel'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{ __html: metaPixelInline }}
        />
        <noscript dangerouslySetInnerHTML={{ __html: metaPixelNoscript }} />
        <Analytics />
      </body>
    </html>
  );
}
