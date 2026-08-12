import type { MetadataRoute } from 'next';
import { getAllArticles } from './lib/articles';
import { siteUrl } from './lib/site';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();

  const routes: MetadataRoute.Sitemap = [
    '',
    '/projects',
    '/blog',
    '/resume',
    '/uses',
  ].map((route) => ({
    url: `${siteUrl}${route}/`,
    changeFrequency: 'monthly',
  }));

  const posts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/blog/${article.slug}/`,
    lastModified: article.date,
  }));

  return [...routes, ...posts];
}
