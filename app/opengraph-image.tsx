import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const alt = 'William White - Senior Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        backgroundColor: '#18181b',
        backgroundImage:
          'radial-gradient(circle at 25% 25%, #27272a 0%, #18181b 50%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '96px',
          height: '10px',
          backgroundColor: '#06b6d4',
          borderRadius: '9999px',
          marginBottom: '48px',
        }}
      />
      <div
        style={{
          display: 'flex',
          fontSize: '84px',
          fontWeight: 700,
          color: '#fafafa',
          letterSpacing: '-0.025em',
        }}
      >
        William White
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: '24px',
          fontSize: '40px',
          color: '#a1a1aa',
        }}
      >
        Senior Software Engineer
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: '72px',
          fontSize: '30px',
          color: '#06b6d4',
        }}
      >
        willwhite.dev
      </div>
    </div>,
    { ...size },
  );
}
