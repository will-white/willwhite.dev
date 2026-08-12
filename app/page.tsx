import { Container } from './components/Container';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { GitHubIcon, LinkedInIcon } from './components/SocialIcons';
import { Card } from './components/Card';
import { socials } from './lib/site';
import headshot from './images/headshot.jpg';

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
  target = '_blank',
}: {
  className?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  target?: string;
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        target={target}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-cyan-500 dark:text-zinc-200 dark:hover:text-cyan-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-cyan-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  );
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  );
}

function StarIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

/* Curated rather than sorted-by-stars so the section stays meaningful.
   Order here is display order. */
const featuredRepoNames = [
  'home-k8s-cluster',
  'dahua-companion',
  'adguard-external-dns-sidecar',
  'willwhite.dev',
];

/* Fetched once at build time (output: 'export'), so the deployed page is
   fully static. Failures just hide the section rather than break the build. */
async function getFeaturedRepos(): Promise<Repo[]> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(
      'https://api.github.com/users/will-white/repos?per_page=100&type=owner',
      { headers },
    );
    if (!res.ok) return [];
    const repos = (await res.json()) as Repo[];
    return featuredRepoNames
      .map((name) => repos.find((repo) => repo.name === name))
      .filter((repo): repo is Repo => repo !== undefined);
  } catch {
    return [];
  }
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <Card as="li">
      <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={repo.html_url} target="_blank">
          {repo.name}
        </Card.Link>
      </h3>
      <Card.Description>
        {repo.description ?? 'No description yet.'}
      </Card.Description>
      <p className="relative z-10 mt-4 flex items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500">
        {repo.language && <span>{repo.language}</span>}
        <span className="flex items-center gap-1">
          <StarIcon className="h-3.5 w-3.5 fill-current" />
          {repo.stargazers_count}
        </span>
      </p>
    </Card>
  );
}

export default async function Home() {
  const repos = await getFeaturedRepos();

  return (
    <>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={headshot}
                alt="headshot"
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              I’m William White, a Senior Software Engineer.
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p className="animate-fade-up [animation-delay:100ms]">
                I’m a polyglot engineer with more than a decade of experience
                building scalable B2B applications — most of it split between
                the .NET ecosystem and TypeScript, with React, Angular, and
                Node.js along the way.
              </p>
              <p className="animate-fade-up [animation-delay:200ms]">
                At SkySlope I worked on{' '}
                <Link
                  href="https://skyslope.com/products-services/forms/"
                  target="_blank"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-400"
                >
                  SkySlope Forms
                </Link>
                , a document platform for real estate brokerages serving more
                than 10,000 daily concurrent users — where I helped keep uptime
                at 99.999% and led a streaming and deferred-execution effort
                that cut cluster costs by 40%.
              </p>
              <p className="animate-fade-up [animation-delay:300ms]">
                Before that I spent eight years at ARMtech Insurance Services
                building crop insurance software, including{' '}
                <Link
                  href="https://www.agrisompo.com/resources/technology/agrinet/"
                  target="_blank"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-400"
                >
                  AgriNet
                </Link>{' '}
                — from a unified single sign-on for 10K+ users to a 45x speedup
                of a core processing service.
              </p>
              <p className="animate-fade-up [animation-delay:400ms]">
                Off the clock I run a{' '}
                <Link
                  href="https://github.com/will-white/home-k8s-cluster"
                  target="_blank"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-400"
                >
                  GitOps-driven, eight-node Talos Kubernetes homelab
                </Link>{' '}
                and write small tools in Go for home automation. If you have a
                project you think I’d be a good fit for — or just want to
                connect — don’t hesitate to reach out.
              </p>
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink
                href={socials.github}
                icon={GitHubIcon}
                className="mt-4"
              >
                GitHub
              </SocialLink>
              <SocialLink
                href={socials.linkedin}
                icon={LinkedInIcon}
                className="mt-4"
              >
                LinkedIn
              </SocialLink>
              <SocialLink
                href={`mailto:${socials.email}`}
                icon={MailIcon}
                target="_self"
                className="mt-4"
              >
                {socials.email}
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
      {repos.length > 0 && (
        <Container className="mt-24 md:mt-28">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
              Open source
            </h2>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              A few repositories from my GitHub, refreshed every deploy.
            </p>
          </div>
          <ul
            role="list"
            className="mt-10 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2"
          >
            {repos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </ul>
        </Container>
      )}
    </>
  );
}
