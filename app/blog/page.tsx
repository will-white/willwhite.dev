import { pageMetadata } from '../lib/metadata';

import { Card } from '../components/Card';
import { SimpleLayout } from '../components/SimpleLayout';
import { type ArticleWithSlug, getAllArticles } from '../lib/articles';
import { formatDate } from '../lib/formatDate';

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/blog/${article.slug}`}>{article.title}</Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)} · {article.readingTime} min read
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 max-md:hidden"
      >
        <span>
          {formatDate(article.date)}
          <span className="mt-1 block">{article.readingTime} min read</span>
        </span>
      </Card.Eyebrow>
    </article>
  );
}

export const metadata = pageMetadata({
  title: 'Blog',
  description:
    'Notes on software engineering, homelabs, and things I’ve built.',
  path: '/blog/',
});

export default async function Blog() {
  const articles = await getAllArticles();

  return (
    <SimpleLayout
      title="Writing about software, homelabs, and whatever I’m tinkering with."
      intro="Long-form notes on things I’ve built and problems I’ve debugged, in the hope that someone else hits the same wall and finds this instead of spending their weekend on it."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <Article key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  );
}
