import clsx from 'clsx';

export function Prose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'prose dark:prose-invert',
        'prose-a:font-medium prose-a:text-cyan-600 dark:prose-a:text-cyan-400',
        // Drop the backticks the typography plugin wraps inline code in.
        'prose-code:before:content-none prose-code:after:content-none',
        // Light code blocks in light mode so the light syntax theme reads.
        'prose-pre:bg-zinc-50 prose-pre:text-zinc-800 prose-pre:ring-1 prose-pre:ring-zinc-200 dark:prose-pre:bg-zinc-800/60 dark:prose-pre:text-zinc-100 dark:prose-pre:ring-zinc-700/40',
      )}
      {...props}
    />
  );
}
