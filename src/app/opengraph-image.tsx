import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kvik';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Zadani OG image za Kvik (uklj. /share/[uuid]). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 64,
          background: 'linear-gradient(135deg, #0b0f0e 0%, #111916 50%, #0d9488 120%)',
          color: '#f0faf8',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Kvik<span style={{ color: '#5eead4' }}>.</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 32, fontWeight: 600, opacity: 0.95 }}>
          AI za paušalni obrt
        </div>
        <div style={{ marginTop: 16, fontSize: 22, opacity: 0.75 }}>
          KPR · PO-SD · porezni rokovi
        </div>
      </div>
    ),
    { ...size },
  );
}
