import Link from 'next/link';

import { ContainerInner, ContainerOuter } from './Container';

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

export function Footer() {
  return (
    <footer className="mt-8 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/articles">Articles</NavLink>
                <NavLink href="/resume">Resume</NavLink>
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  );
}
