'use client';

import { useState, useCallback } from 'react';

type ShareBarProps = {
  url: string;
  shareText: string;
  pageType: 'vodic' | 'alat' | 'ai-share' | 'other';
  pageSlug: string;
};

type Channel = 'native' | 'whatsapp' | 'copy' | 'facebook' | 'x' | 'linkedin' | 'email';

const trackShare = (channel: Channel, pageType: string, pageSlug: string) => {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', 'share_click', {
    channel,
    page_type: pageType,
    page_slug: pageSlug,
  });
};

const buildUrl = (base: string, channel: Channel, pageSlug: string) => {
  try {
    const u = new URL(base);
    u.searchParams.set('utm_source', 'share');
    u.searchParams.set('utm_medium', channel);
    u.searchParams.set('utm_campaign', pageSlug);
    return u.toString();
  } catch {
    return base;
  }
};

export default function ShareBar({ url, shareText, pageType, pageSlug }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleNative = useCallback(async () => {
    const link = buildUrl(url, 'native', pageSlug);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text: shareText.replace('{url}', link), url: link });
        trackShare('native', pageType, pageSlug);
      } catch {
        /* korisnik otkazao */
      }
    }
  }, [url, shareText, pageType, pageSlug]);

  const handleCopy = useCallback(async () => {
    const link = buildUrl(url, 'copy', pageSlug);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      trackShare('copy', pageType, pageSlug);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback nije potreban — moderni browseri to imaju */
    }
  }, [url, pageType, pageSlug]);

  const openChannel = useCallback(
    (channel: Channel, hrefBuilder: (link: string, text: string) => string) => {
      const link = buildUrl(url, channel, pageSlug);
      const text = shareText.replace('{url}', link);
      window.open(hrefBuilder(link, text), '_blank', 'noopener,noreferrer');
      trackShare(channel, pageType, pageSlug);
    },
    [url, shareText, pageType, pageSlug],
  );

  const hasNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs text-slate-400">Podijeli:</span>

      {hasNativeShare && (
        <button
          onClick={handleNative}
          className="rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white transition hover:bg-teal-500"
          aria-label="Podijeli (native)"
        >
          Podijeli
        </button>
      )}

      <button
        onClick={() =>
          openChannel('whatsapp', (_link, text) => `https://wa.me/?text=${encodeURIComponent(text)}`)
        }
        className="rounded-md bg-slate-800 px-2.5 py-1.5 text-sm text-slate-100 transition hover:bg-slate-700"
        aria-label="WhatsApp"
      >
        WhatsApp
      </button>

      <button
        onClick={handleCopy}
        className="rounded-md bg-slate-800 px-2.5 py-1.5 text-sm text-slate-100 transition hover:bg-slate-700"
        aria-label="Kopiraj link"
      >
        {copied ? 'Kopirano!' : 'Kopiraj link'}
      </button>

      <button
        onClick={() =>
          openChannel(
            'facebook',
            (link) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
          )
        }
        className="rounded-md bg-slate-800 px-2.5 py-1.5 text-sm text-slate-100 transition hover:bg-slate-700"
        aria-label="Facebook"
      >
        FB
      </button>

      <button
        onClick={() =>
          openChannel(
            'x',
            (_link, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
          )
        }
        className="rounded-md bg-slate-800 px-2.5 py-1.5 text-sm text-slate-100 transition hover:bg-slate-700"
        aria-label="X"
      >
        X
      </button>

      <button
        onClick={() =>
          openChannel(
            'linkedin',
            (link) =>
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
          )
        }
        className="rounded-md bg-slate-800 px-2.5 py-1.5 text-sm text-slate-100 transition hover:bg-slate-700"
        aria-label="LinkedIn"
      >
        LinkedIn
      </button>

      <button
        onClick={() =>
          openChannel(
            'email',
            (link, text) =>
              `mailto:?subject=${encodeURIComponent('Kvik — koristan link')}&body=${encodeURIComponent(text)}`,
          )
        }
        className="rounded-md bg-slate-800 px-2.5 py-1.5 text-sm text-slate-100 transition hover:bg-slate-700"
        aria-label="Email"
      >
        Email
      </button>
    </div>
  );
}
