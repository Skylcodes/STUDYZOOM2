'use client';

import { MoonIcon } from '@radix-ui/react-icons';

import { Button, type ButtonProps } from '@/components/ui/button';

export type ThemeToggleProps = Omit<
  ButtonProps,
  'variant' | 'size' | 'onClick'
>;

export function ThemeToggle({
  className,
  ...props
}: ThemeToggleProps): React.JSX.Element {
  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      disabled
      {...props}
    >
      <MoonIcon className="size-5" aria-hidden="true" />
      <span className="sr-only">Dark mode</span>
    </Button>
  );
}
