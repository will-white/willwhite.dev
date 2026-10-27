import clsx from 'clsx';
import Link from 'next/link';

import { Container } from './Container';
import { Prose } from './Prose';
import { getAllArticles } from '../lib/articles';
import { formatDate } from '../lib/formatDate';

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdjacentArticle({
  label,
  article,
  align,
}: {
  label: string;
  article?: { slug: string; title: string };
  align: 'left' | 'right';
}) {
  if (!article) {
    return <div />;
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className={clsx(
        'group flex flex-col gap-1',
        align === 'right' && 'sm:items-end sm:text-right',
      )}
    >
      <span className="text-sm text-zinc-400 dark:text-zinc-500">{label}</span>
      <span className="text-base font-semibold text-zinc-800 transition group-hover:text-cyan-500 dark:text-zinc-100 dark:group-hover:text-cyan-400">
        {article.title}
      </span>
    </Link>
  );
}

export async function ArticleLayout({
  article,
  slug,
  children,
}: {
  article: { title: string; date: string };
  /** The post's folder name under app/blog. */
  slug: string;
  children: React.ReactNode;
}) {
  // Newest first, so the entry before this one is the newer post.
  const articles = await getAllArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  const readingTime = articles[index]?.readingTime;
  const newer = index > 0 ? articles[index - 1] : undefined;
  const older = index >= 0 ? articles[index + 1] : undefined;

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/blog"
            aria-label="Back to blog"
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20"
          >
            <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
          </Link>
          <article>
            <header className="flex flex-col">
              <h1 className="animate-fade-up mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                {article.title}
              </h1>
              <time
                dateTime={article.date}
                className="animate-fade-up order-first flex items-center text-base text-zinc-400 [animation-delay:100ms] dark:text-zinc-500"
              >
                <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                <span className="ml-3">
                  {formatDate(article.date)}
                  {readingTime && ` · ${readingTime} min read`}
                </span>
              </time>
            </header>
            <Prose
              className="animate-fade-up mt-8 [animation-delay:200ms]"
              data-mdx-content
            >
              {children}
            </Prose>
          </article>
          {(newer || older) && (
            <nav
              aria-label="More posts"
              className="mt-16 grid gap-8 border-t border-zinc-100 pt-10 sm:grid-cols-2 dark:border-zinc-700/40"
            >
              <AdjacentArticle
                label="Older post"
                article={older}
                align="left"
              />
              <AdjacentArticle
                label="Newer post"
                article={newer}
                align="right"
              />
            </nav>
          )}
        </div>
      </div>
    </Container>
  );
}
