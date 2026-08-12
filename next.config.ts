import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages serves directories via index.html; without this the export
  // emits e.g. blog.html and /blog/ (trailing slash) 404s.
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
