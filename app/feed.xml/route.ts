import { getAllArticles } from '../lib/articles';
import { siteDescription, siteUrl } from '../lib/site';

export const dynamic = 'force-static';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toRfc822(date: string) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export async function GET() {
  const articles = await getAllArticles();
  // The newest post's date rather than the clock, so rebuilding without new
  // content doesn't make feed readers think the feed changed.
  const lastBuildDate = toRfc822(articles[0]?.date ?? '1970-01-01');

  const items = articles
    .map((article) => {
      const url = `${siteUrl}/blog/${article.slug}/`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${toRfc822(article.date)}</pubDate>
    </item>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>William White</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteDescription)}</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
