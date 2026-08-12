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
      )}
      {...props}
    />
  );
}
