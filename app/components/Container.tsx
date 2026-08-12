import clsx from 'clsx';

export function ContainerOuter({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('sm:px-8', className)} {...props}>
      <div className="mx-auto h-full w-full max-w-7xl lg:px-8">{children}</div>
    </div>
  );
}

export function ContainerInner({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx('relative h-full px-4 sm:px-8 lg:px-12', className)}
      {...props}
    >
      <div className="mx-auto h-full max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  );
}

export function Container({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContainerOuter>) {
  return (
    <ContainerOuter {...props}>
      <ContainerInner>{children}</ContainerInner>
    </ContainerOuter>
  );
}
