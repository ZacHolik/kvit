import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { DM_Sans, Syne } from 'next/font/google';

import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Kvit',
  description: 'SaaS za hrvatske pausalne obrtnike',
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
      </body>
    </html>
  );
}
