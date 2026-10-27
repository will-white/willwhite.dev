import { readFile } from 'node:fs/promises';
import glob from 'fast-glob';

interface Article {
  title: string;
  description: string;
  author: string;
  date: string;
}

export interface ArticleWithSlug extends Article {
  slug: string;
  readingTime: number;
}

const blogDir = './app/blog';
const wordsPerMinute = 230;

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  const { article } = (await import(`../blog/${articleFilename}`)) as {
    default: React.ComponentType;
    article: Article;
  };
  const source = await readFile(`${blogDir}/${articleFilename}`, 'utf8');
  const words = source.split(/\s+/).filter(Boolean).length;

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    readingTime: Math.max(1, Math.round(words / wordsPerMinute)),
    ...article,
  };
}

export async function getAllArticles() {
  const articleFilenames = await glob('*/page.mdx', {
    cwd: blogDir,
  });

  const articles = await Promise.all(articleFilenames.map(importArticle));

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}
