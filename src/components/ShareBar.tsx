'use client';

import { useState, useCallback } from 'react';
import {
  Briefcase,
  Check,
  Link2,
  Mail,
  MessageCircle,
  Send,
  Share,
  Share2,
} from 'lucide-react';

type ShareBarProps = {
  url: string;
  shareText: string;
  pageType: 'vodic' | 'alat' | 'ai-share' | 'other';
  pageSlug: string;
};

type Channel = 'native' | 'whatsapp' | 'copy' | 'facebook' | 'x' | 'linkedin' | 'email';

const ICON_SIZE = 18;

const btnBase =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition';
const btnDark = `${btnBase} bg-gray-800 text-slate-100 hover:bg-gray-700`;
const btnGreen = `${btnBase} bg-emerald-600 text-white hover:bg-emerald-500`;

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
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs text-slate-400">Podijeli:</span>

      {hasNativeShare && (
        <button
          type="button"
          onClick={handleNative}
          className={btnGreen}
          title="Podijeli"
          aria-label="Podijeli"
        >
          <Share2 size={ICON_SIZE} aria-hidden />
        </button>
      )}

      <button
        type="button"
        onClick={() =>
          openChannel('whatsapp', (_link, text) => `https://wa.me/?text=${encodeURIComponent(text)}`)
        }
        className={btnDark}
        title="WhatsApp"
        aria-label="WhatsApp"
      >
        <MessageCircle size={ICON_SIZE} aria-hidden />
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className={btnDark}
        title={copied ? 'Kopirano!' : 'Kopiraj link'}
        aria-label={copied ? 'Kopirano!' : 'Kopiraj link'}
      >
        {copied ? (
          <Check size={ICON_SIZE} aria-hidden />
        ) : (
          <Link2 size={ICON_SIZE} aria-hidden />
        )}
      </button>

      <button
        type="button"
        onClick={() =>
          openChannel(
            'facebook',
            (link) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
          )
        }
        className={btnDark}
        title="Facebook"
        aria-label="Facebook"
      >
        <Share size={ICON_SIZE} aria-hidden />
      </button>

      <button
        type="button"
        onClick={() =>
          openChannel(
            'x',
            (_link, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
          )
        }
        className={btnDark}
        title="X"
        aria-label="X"
      >
        <Send size={ICON_SIZE} aria-hidden />
      </button>

      <button
        type="button"
        onClick={() =>
          openChannel(
            'linkedin',
            (link) =>
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
          )
        }
        className={btnDark}
        title="LinkedIn"
        aria-label="LinkedIn"
      >
        <Briefcase size={ICON_SIZE} aria-hidden />
      </button>

      <button
        type="button"
        onClick={() =>
          openChannel(
            'email',
            (link, text) =>
              `mailto:?subject=${encodeURIComponent('Kvik — koristan link')}&body=${encodeURIComponent(text)}`,
          )
        }
        className={btnDark}
        title="Email"
        aria-label="Email"
      >
        <Mail size={ICON_SIZE} aria-hidden />
      </button>
    </div>
  );
}
