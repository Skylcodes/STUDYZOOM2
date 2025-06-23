'use client';

import * as React from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  LucideIcon
} from 'lucide-react';

import { GlassCard } from '@/components/ui/glass-card';
import { MiniStat } from '@/components/ui/mini-stat';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  delta?: number;
  icon: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  delta,
  icon,
  className
}: StatCardProps): React.JSX.Element {
  // Map icon string to Lucide component
  const IconComponent: LucideIcon = React.useMemo(() => {
    switch (icon) {
      case 'dollar':
        return DollarSign;
      case 'users':
        return Users;
      case 'shopping-cart':
        return ShoppingCart;
      case 'trending-up':
        return TrendingUp;
      default:
        return TrendingUp;
    }
  }, [icon]);

  return (
    <GlassCard 
      variant="dark" 
      size="sm" 
      hover="dark" 
      elevation={2}
      className={cn('h-full', className)}
    >
      <MiniStat
        title={title}
        value={value}
        delta={delta}
        icon={IconComponent}
        iconClassName={cn(
          delta !== undefined && delta >= 0 
            ? 'bg-emerald-500/10 text-emerald-500' 
            : 'bg-rose-500/10 text-rose-500'
        )}
      />
    </GlassCard>
  );
}
