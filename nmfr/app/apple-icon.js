import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0b0d',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 74, fontWeight: 800, color: '#ccff33', letterSpacing: -4 }}>
          SF
        </div>
        <div style={{ display: 'flex', fontSize: 15, color: '#9a9aa6', marginTop: 6 }}>
          shoe finder
        </div>
      </div>
    ),
    size
  );
}
