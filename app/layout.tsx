import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Will White - Sr. Software Engineer',
  description: 'Portfolio and personal website for Will White, Sr. Software Engineer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
