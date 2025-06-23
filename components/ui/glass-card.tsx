import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const glassCardVariants = cva(
  'relative overflow-hidden rounded-2xl border border-white/5 transition-all duration-300 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/5 shadow-lg',
        primary: 'border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/10',
        accent: 'border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 shadow-lg shadow-accent/10',
        destructive: 'border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 shadow-lg shadow-destructive/10',
        muted: 'border-muted/40 bg-muted/10 shadow-lg',
        gradient: 'border-transparent bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg shadow-primary/20',
        dark: 'border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-900/50 shadow-xl shadow-black/30'
      },
      size: {
        sm: 'p-4',
        default: 'p-5',
        lg: 'p-7',
        xl: 'p-8'
      },
      hover: {
        default: 'hover:shadow-lg hover:border-white/20 hover:bg-white/10 hover:scale-[1.01]',
        primary: 'hover:shadow-xl hover:border-primary/40 hover:bg-primary/15 hover:scale-[1.01]',
        accent: 'hover:shadow-xl hover:border-accent/40 hover:bg-accent/15 hover:scale-[1.01]',
        destructive: 'hover:shadow-xl hover:border-destructive/40 hover:bg-destructive/15 hover:scale-[1.01]',
        muted: 'hover:shadow-lg hover:border-muted/30 hover:bg-muted/20 hover:scale-[1.01]',
        gradient: 'hover:shadow-2xl hover:scale-[1.02] hover:shadow-primary/30',
        dark: 'hover:bg-gray-900/70 hover:border-white/20 hover:shadow-2xl hover:scale-[1.01]',
        none: ''
      },
      elevation: {
        1: 'backdrop-blur-sm shadow-sm',
        2: 'backdrop-blur-md shadow-md',
        3: 'backdrop-blur-lg shadow-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hover: 'default',
      elevation: 2
    }
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  glow?: boolean;
}

export function GlassCard({
  className,
  variant,
  size,
  hover,
  elevation,
  glow,
  children,
  ...props
}: GlassCardProps): React.JSX.Element {
  const glowClass = React.useMemo(() => {
    if (!glow) return '';
    if (variant === 'primary') return 'shadow-primary-glow';
    if (variant === 'accent') return 'shadow-glow';
    if (variant === 'destructive') return 'shadow-glow';
    if (variant === 'muted') return 'shadow-glow';
    if (variant === 'gradient') return 'shadow-glow';
    if (variant === 'dark') return 'shadow-glow';
    return 'shadow-glow';
  }, [glow, variant]);

  return (
    <div
      className={cn(glassCardVariants({ variant, size, hover, elevation }), glowClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}
