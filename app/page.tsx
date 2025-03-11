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
  title: 'William White',
  description: 'Hi, I’m William White.',
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
            Hi, I’m William White, a Sr. Software Engineer and nerd.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Ridiculus
              tortor litora dictumst, per nibh tempus malesuada duis penatibus.
              In tincidunt eu libero cursus nulla quis. Sociosqu porta consequat
              elementum congue suscipit urna metus pellentesque nibh. Tempus
              parturient ullamcorper erat euismod mattis eget. Nulla scelerisque
              erat eget lacus quisque leo. Et nunc hac montes turpis vestibulum
              erat aptent. Litora ullamcorper suscipit dignissim convallis
              sollicitudin diam vivamus placerat. Cras mollis ante a id luctus.
            </p>
            <p>
              Congue curae rutrum elementum convallis libero ac ad nullam.
              Nascetur parturient sapien nisi interdum sit; diam diam.
              Pellentesque feugiat ornare consectetur consectetur, ante potenti
              in duis. Mollis congue porta aliquam aliquam interdum amet enim.
              Himenaeos luctus ligula mus sollicitudin ligula lobortis.
              Scelerisque est consectetur ante eget libero. Facilisis sit magnis
              feugiat natoque et tempor.
            </p>
            <p>
              Pulvinar purus eleifend sociosqu dignissim ipsum fames fusce.
              Tempus natoque volutpat himenaeos, litora pretium orci.
              Ullamcorper luctus rutrum donec elementum inceptos scelerisque
              tincidunt aptent pharetra. Ligula mauris nisi natoque arcu
              porttitor sapien at fusce. Non torquent vitae metus faucibus nec
              nunc convallis dapibus? Orci morbi condimentum est varius vitae.
              Sollicitudin dui vulputate sociosqu mi lectus. Consectetur nullam
              iaculis egestas lobortis consectetur.
            </p>
            <p>
              Vel per in nunc vivamus scelerisque rhoncus eget fermentum etiam.
              Posuere dis tellus leo efficitur iaculis sollicitudin proin
              platea. Nostra rutrum neque lobortis porta pharetra vestibulum
              curae. Euismod nunc per varius praesent fermentum sodales integer
              inceptos blandit. Risus ut magnis libero vitae accumsan. Erat
              viverra sociosqu pharetra nullam tellus nibh nullam facilisi.
              Habitasse est posuere lectus torquent porta ultricies sodales.
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
