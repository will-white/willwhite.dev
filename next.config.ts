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

// Plugins are named by string, not imported: Turbopack passes MDX options to
// a loader and can only serialise plain data.
const withMDX = createMDX({
  options: {
    rehypePlugins: [
      // Build-time syntax highlighting; ships no client JS.
      [
        'rehype-pretty-code',
        {
          theme: { light: 'github-light', dark: 'github-dark' },
          keepBackground: false,
          defaultLang: 'plaintext',
        },
      ],
      'rehype-slug',
      [
        'rehype-autolink-headings',
        {
          behavior: 'append',
          properties: {
            className: ['heading-anchor'],
            ariaHidden: true,
            tabIndex: -1,
          },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
