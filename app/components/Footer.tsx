import Link from 'next/link';

import { ContainerInner, ContainerOuter } from './Container';
import { GitHubIcon, LinkedInIcon } from './SocialIcons';
import { navigation, socials } from '../lib/site';

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="transition hover:text-cyan-500 dark:hover:text-cyan-400"
    >
      {children}
    </Link>
  );
}

function SocialIconLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link href={href} aria-label={label} target="_blank" className="group">
      <Icon className="h-5 w-5 fill-zinc-500 transition group-hover:fill-cyan-500" />
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-8 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {navigation
                  .filter((item) => item.href !== '/')
                  .map((item) => (
                    <NavLink key={item.href} href={item.href}>
                      {item.label}
                    </NavLink>
                  ))}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-4">
                  <SocialIconLink
                    href={socials.github}
                    label="GitHub"
                    icon={GitHubIcon}
                  />
                  <SocialIconLink
                    href={socials.linkedin}
                    label="LinkedIn"
                    icon={LinkedInIcon}
                  />
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  &copy; {new Date().getFullYear()} William White. All rights
                  reserved.
                </p>
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  );
}
