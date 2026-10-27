import { ImageResponse } from 'next/og';

export const ogImageSize = { width: 1200, height: 630 };

/* Rendered at build time by the og.png route handlers. They are route
   handlers rather than opengraph-image.tsx files so the exported files end
   in .png: GitHub Pages picks Content-Type from the extension, and the
   file-based convention exports an extensionless `opengraph-image`. */
export function renderOgImage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
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
          fontSize: title.length > 32 ? '64px' : '84px',
          fontWeight: 700,
          lineHeight: 1.1,
          color: '#fafafa',
          letterSpacing: '-0.025em',
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: '24px',
          fontSize: '40px',
          color: '#a1a1aa',
        }}
      >
        {subtitle}
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
    ogImageSize,
  );
}
