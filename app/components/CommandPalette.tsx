'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react';

import { navigation, socials } from '../lib/site';

type Command = {
  id: string;
  name: string;
  section: string;
  keywords?: string;
  href?: string;
  external?: boolean;
  theme?: string;
};

const commands: Command[] = [
  ...navigation.map((item) => ({
    id: `page-${item.href}`,
    name: item.label,
    section: 'Pages',
    href: item.href,
  })),
  {
    id: 'social-github',
    name: 'GitHub',
    section: 'Elsewhere',
    keywords: 'code repositories open source',
    href: socials.github,
    external: true,
  },
  {
    id: 'social-linkedin',
    name: 'LinkedIn',
    section: 'Elsewhere',
    keywords: 'connect work profile',
    href: socials.linkedin,
    external: true,
  },
  {
    id: 'social-email',
    name: 'Send me an email',
    section: 'Elsewhere',
    keywords: `contact mail ${socials.email}`,
    href: `mailto:${socials.email}`,
    external: true,
  },
  {
    id: 'theme-light',
    name: 'Switch to light theme',
    section: 'Theme',
    keywords: 'appearance mode day',
    theme: 'light',
  },
  {
    id: 'theme-dark',
    name: 'Switch to dark theme',
    section: 'Theme',
    keywords: 'appearance mode night',
    theme: 'dark',
  },
  {
    id: 'theme-system',
    name: 'Use system theme',
    section: 'Theme',
    keywords: 'appearance mode auto',
    theme: 'system',
  },
];

function MagnifyingGlassIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.5-2 4.75 4.75"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setOpen((wasOpen) => !wasOpen);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function close() {
    setOpen(false);
    setQuery('');
  }

  function runCommand(command: Command | null) {
    if (!command) return;
    close();
    if (command.theme) {
      setTheme(command.theme);
    } else if (command.href && command.external) {
      window.open(
        command.href,
        command.href.startsWith('mailto:') ? '_self' : '_blank',
      );
    } else if (command.href) {
      router.push(command.href);
    }
  }

  const filtered =
    query === ''
      ? commands
      : commands.filter((command) =>
          `${command.name} ${command.section} ${command.keywords ?? ''}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        );

  const sections = [...new Set(filtered.map((command) => command.section))];

  return (
    <>
      <button
        type="button"
        aria-label="Open command palette"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
      >
        <MagnifyingGlassIcon className="h-6 w-6 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
        <kbd className="hidden font-sans text-xs font-medium text-zinc-400 md:block dark:text-zinc-500">
          ⌘K
        </kbd>
      </button>
      <Dialog open={open} onClose={close} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-zinc-800/40 backdrop-blur-sm duration-150 data-closed:opacity-0 dark:bg-black/80"
        />
        <div className="fixed inset-0 flex items-start justify-center p-4 pt-[15vh]">
          <DialogPanel
            transition
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/7.5 duration-150 data-closed:scale-95 data-closed:opacity-0 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <Combobox onChange={runCommand}>
              <div className="flex items-center gap-3 border-b border-zinc-100 px-4 dark:border-zinc-800">
                <MagnifyingGlassIcon className="h-5 w-5 flex-none stroke-zinc-400" />
                <ComboboxInput
                  autoFocus
                  placeholder="Search pages, links, and settings…"
                  className="h-12 w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              {filtered.length > 0 ? (
                <ComboboxOptions
                  static
                  className="max-h-80 overflow-y-auto p-2"
                >
                  {sections.map((section) => (
                    <div key={section}>
                      <p className="px-2 pt-3 pb-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                        {section}
                      </p>
                      {filtered
                        .filter((command) => command.section === section)
                        .map((command) => (
                          <ComboboxOption
                            key={command.id}
                            value={command}
                            className="cursor-pointer rounded-lg px-2 py-2 text-sm text-zinc-700 select-none data-focus:bg-cyan-500 data-focus:text-white dark:text-zinc-300"
                          >
                            {command.name}
                          </ComboboxOption>
                        ))}
                    </div>
                  ))}
                </ComboboxOptions>
              ) : (
                <p className="p-6 text-center text-sm text-zinc-500">
                  Nothing found — try a different search.
                </p>
              )}
            </Combobox>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
