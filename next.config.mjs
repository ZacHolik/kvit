import nextPwa from 'next-pwa';

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
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: '/alati/kalkulator', destination: '/alati/kalkulator-poreza', permanent: true },
      { source: '/alati/doprinosi', destination: '/alati/placanje-doprinosa', permanent: true },
      { source: '/po-sd', destination: '/alati/po-sd', permanent: false },
      { source: '/probaj', destination: '/alati/kalkulator', permanent: false },
      { source: '/registracija', destination: '/register', permanent: false },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withPWA(nextConfig);
