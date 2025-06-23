import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const miniStatVariants = cva('flex items-center', {
  variants: {
    layout: {
      default: 'flex-row justify-between w-full',
      vertical: 'flex-col items-start gap-2'
    }
  },
  defaultVariants: {
    layout: 'default'
  }
});

export interface MiniStatProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof miniStatVariants> {
  title: string;
  value: string | number;
  delta?: number;
  icon?: LucideIcon;
  iconClassName?: string;
}

export function MiniStat({
  className,
  layout,
  title,
  value,
  delta,
  icon: Icon,
  iconClassName,
  ...props
}: MiniStatProps): React.JSX.Element {
  const deltaColor = delta === undefined ? '' : delta >= 0 ? 'text-emerald-500' : 'text-rose-500';
  const deltaSymbol = delta === undefined ? '' : delta >= 0 ? '+' : '';
  
  return (
    <div className={cn(miniStatVariants({ layout }), className)} {...props}>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {delta !== undefined && (
            <span className={cn('text-sm font-medium', deltaColor)}>
              {deltaSymbol}{delta}%
            </span>
          )}
        </div>
      </div>
      
      {Icon && (
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-primary/10', iconClassName)}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
    </div>
  );
}
