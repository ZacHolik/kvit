import nextPwa from 'next-pwa';
import { withSentryConfig } from '@sentry/nextjs';

const withPWA = nextPwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: '/alati/kalkulator', destination: '/alati/kalkulator-poreza', permanent: true },
      { source: '/alati/doprinosi', destination: '/alati/placanje-doprinosa', permanent: true },
      { source: '/probaj', destination: '/alati/kalkulator', permanent: false },
      { source: '/registracija', destination: '/register', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/alati/po-sd',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withSentryConfig(withPWA(nextConfig), {
  org: 'kvik-tq',
  project: 'kvik-web',
  silent: true,
  hideSourceMaps: true,
  disableLogger: true,
});
