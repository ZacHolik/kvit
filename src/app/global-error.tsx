'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#0b0f0e',
            color: '#e2e8e7',
            fontFamily: 'sans-serif',
            gap: '16px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#0d9488', fontSize: '24px', margin: 0 }}>
            Nešto je pošlo po krivu
          </h2>
          <p style={{ color: '#94a3a0', fontSize: '14px', margin: 0 }}>
            Greška je zabilježena. Pokušaj ponovno ili kontaktiraj
            podrška@kvik.hr.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Pokušaj ponovno
          </button>
        </div>
      </body>
    </html>
  );
}
