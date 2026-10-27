import type { Metadata } from 'next';

import { ogImageSize } from './og';
import { siteTitle, siteUrl } from './site';

const siteName = 'William White';

/* Next.js replaces (not merges) a parent's openGraph, twitter and alternates
   objects when a page sets its own, so every page builds all three here.
   Without this, pages inherited the root layout's, and shared links to any
   page previewed as the home page. */
export function pageMetadata({
  title,
  description,
  path,
  image = '/og.png',
  publishedTime,
}: {
  /** Page title without the " - William White" suffix; omit on the home page. */
  title?: string;
  description: string;
  /** Site-relative path with a trailing slash, e.g. `/blog/`. */
  path: string;
  image?: string;
  /** ISO date; marks the page as an article. */
  publishedTime?: string;
}): Metadata {
  const fullTitle = title ? `${title} - ${siteName}` : siteTitle;
  const images = [{ url: image, ...ogImageSize, alt: title ?? siteName }];

  return {
    ...(title && { title }),
    description,
    alternates: {
      canonical: path,
      types: { 'application/rss+xml': `${siteUrl}/feed.xml` },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName,
      locale: 'en_US',
      images,
      ...(publishedTime
        ? { type: 'article', publishedTime, authors: [siteName] }
        : { type: 'website' }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images,
    },
  };
}

export function articleMetadata(
  article: { title: string; description: string; date: string },
  slug: string,
): Metadata {
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${slug}/`,
    image: `/og/blog/${slug}/card.png`,
    publishedTime: article.date,
  });
}
