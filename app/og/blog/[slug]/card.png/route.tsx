import { getAllArticles } from '../../../../lib/articles';
import { formatDate } from '../../../../lib/formatDate';
import { renderOgImage } from '../../../../lib/og';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const article = (await getAllArticles()).find((a) => a.slug === slug);
  if (!article) {
    return new Response('Not found', { status: 404 });
  }

  return renderOgImage({
    title: article.title,
    subtitle: `William White · ${formatDate(article.date)}`,
  });
}
