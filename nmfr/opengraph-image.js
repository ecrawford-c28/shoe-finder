import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Shoe Finder: which running shoes should you buy?';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0b0d',
          padding: '70px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#ccff33',
              fontWeight: 700,
            }}
          >
            Shoe Finder
          </div>
          <div style={{ fontSize: 20, color: '#9a9aa6', marginTop: 8 }}>
            by Not Made For Running
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 84,
            lineHeight: 1.02,
            fontWeight: 800,
            color: '#f4f4f2',
            letterSpacing: -3,
          }}
        >
          <div>Which running shoes</div>
          <div style={{ color: '#ccff33' }}>should you buy?</div>
        </div>

        <div style={{ display: 'flex', fontSize: 28, color: '#9a9aa6' }}>
          11 questions. 3 shoes that actually suit you. shoefinder.co.uk
        </div>
      </div>
    ),
    size
  );
}
