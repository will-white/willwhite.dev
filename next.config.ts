import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/willwhite.dev',
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
