import './globals.css';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { pageMetadata } from './lib/metadata';
import { getAllArticles } from './lib/articles';
import { siteDescription, siteTitle, siteUrl, socials } from './lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Defaults for pages without their own metadata (e.g. the 404 page).
  ...pageMetadata({ description: siteDescription, path: '/' }),
  title: {
    template: '%s - William White',
    default: siteTitle,
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'William White',
  url: siteUrl,
  jobTitle: 'Senior Software Engineer',
  email: `mailto:${socials.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Aurora',
    addressRegion: 'CO',
    addressCountry: 'US',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Texas at Arlington',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'MapLarge',
    url: 'https://www.maplarge.com',
  },
  sameAs: [socials.github, socials.linkedin],
  knowsAbout: [
    'C#',
    '.NET',
    'TypeScript',
    'React',
    'Angular',
    'Node.js',
    'Go',
    'Kubernetes',
    'SQL',
    'AWS',
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const articles = (await getAllArticles()).map(
    ({ slug, title, description }) => ({ slug, title, description }),
  );

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Providers>
          <div className="fixed inset-0 flex justify-center sm:px-8 print:hidden">
            <div className="flex w-full max-w-7xl lg:px-8">
              <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
            </div>
          </div>
          <div className="relative flex w-full flex-col">
            <Header articles={articles} />
            <main className="flex-auto">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
