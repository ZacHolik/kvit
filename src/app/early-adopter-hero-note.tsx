'use client';

import { useEffect, useState } from 'react';

const TALLY = 'https://tally.so/r/44or65';
const CAP = 100;

type Layout = 'hero' | 'section' | 'cta';

function barColor(percentFull: number) {
  if (percentFull <= 50) {
    return '#22c55e';
  }
  if (percentFull <= 80) {
    return '#eab308';
  }
  return '#ef4444';
}

/** Sloj 3 A): early adopter progress na landing pageu. */
export function EarlyAdopterHeroNote({ layout }: { layout: Layout }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/public/register-count', { cache: 'no-store' });
        const body = (await res.json()) as { count?: number };
        if (!cancelled) {
          setCount(typeof body.count === 'number' ? body.count : 0);
        }
      } catch {
        if (!cancelled) {
          setCount(0);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filled = Math.min(count, CAP);
  const pct = Math.min((count / CAP) * 100, 100);
  const filledBlocks = Math.round((filled / CAP) * 20);
  const bar = barColor(pct);

  const inner = (
    <>
      <p
        style={{
          color: layout === 'section' ? 'var(--teal2)' : 'var(--text2)',
          fontWeight: layout === 'section' ? 600 : 500,
          fontSize: layout === 'hero' ? '0.95rem' : '1rem',
          lineHeight: 1.45,
        }}
      >
        Prvih 100 paušalista — 5,99€/mj zauvijek.
      </p>
      <div
        style={{
          marginTop: '0.65rem',
          fontFamily: 'var(--font-dm-sans),DM Sans,sans-serif',
          fontSize: '0.78rem',
          color: 'var(--text3)',
          letterSpacing: '0.06em',
          userSelect: 'none',
        }}
        aria-hidden
      >
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              width: '4.2%',
              marginRight: i < 19 ? '0.35%' : 0,
              height: '0.55rem',
              borderRadius: 2,
              backgroundColor: i < filledBlocks ? bar : 'rgba(148,163,184,0.18)',
              verticalAlign: 'middle',
            }}
          />
        ))}{' '}
        <span style={{ marginLeft: '0.35rem', color: 'var(--text2)' }}>
          {filled} / {CAP} zauzeto
        </span>
      </div>
      <div
        style={{
          marginTop: '0.55rem',
          height: 8,
          borderRadius: 999,
          background: 'rgba(148,163,184,0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          className='early-adopter-bar-fill'
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 999,
            background: bar,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <a
        href={TALLY}
        target='_blank'
        rel='noopener noreferrer'
        style={{
          display: 'inline-flex',
          marginTop: '0.85rem',
          fontWeight: 600,
          fontSize: '0.92rem',
          color: 'var(--teal3)',
          textDecoration: 'none',
          gap: '0.25rem',
          alignItems: 'center',
        }}
      >
        Zaključaj cijenu →
      </a>
    </>
  );

  if (layout === 'hero') {
    return <div className='hero-note'>{inner}</div>;
  }
  if (layout === 'section') {
    return (
      <div className='section-sub section-sub--accent' style={{ marginTop: '0.5rem' }}>
        {inner}
      </div>
    );
  }
  return <div className='cta-note'>{inner}</div>;
}
