import { Metadata } from 'next';
import { Container } from './components/Container';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { GitHubIcon, LinkedInIcon } from './components/SocialIcons';
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

export const metadata: Metadata = {
  title: 'William White - Senior Software Engineer',
  description:
    'Senior Software Engineer with a passion for creating innovative and user-friendly solutions.',
};

export default function Home() {
  return (
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
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I’m William White, a Senior Software Engineer.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I am a Senior Software Engineer with a passion for creating
              innovative and user-friendly solutions. I have a strong
              background in full-stack development, with expertise in
              JavaScript, React, Node.js, and a variety of other technologies.
            </p>
            <p>
              I am a problem-solver at heart and enjoy tackling complex
              challenges. I am also a strong believer in teamwork and
              collaboration, and I am always looking for opportunities to learn
              from and share my knowledge with others.
            </p>
            <p>
              Throughout my career, I have had the opportunity to work on a
              variety of projects, from small-scale applications to large,
              enterprise-level systems. I am proud of the work I have done and
              the impact it has had on users.
            </p>
            <p>
              I am always looking for new challenges and opportunities to grow as
              a developer. If you have a project that you think I would be a
              good fit for, or if you just want to connect, please don&apos;t
              hesitate to reach out.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="https://www.github.com/will-white/"
              icon={GitHubIcon}
              className="mt-4"
            >
              GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/will-white-dev/"
              icon={LinkedInIcon}
              className="mt-4"
            >
              LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:contact@willwhite.dev"
              icon={MailIcon}
              target="_self"
              className="mt-4"
            >
              contact@willwhite.dev
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  );
}
