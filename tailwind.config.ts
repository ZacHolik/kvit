import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        bg: '#0b0f0e',
        ink: '#ffffff',
        muted: '#a8bdb9',
        mutedDim: '#7c928d',
        teal: '#0d9488',
        tealHover: '#14b8a6',
        tealSoft: 'rgba(13,148,136,0.15)',
        tealSofter: 'rgba(13,148,136,0.08)',
        tealBorder: 'rgba(13,148,136,0.35)',
        success: '#22d3a5',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
