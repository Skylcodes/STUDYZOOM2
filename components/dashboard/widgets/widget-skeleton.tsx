'use client';

import * as React from 'react';

import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface WidgetSkeletonProps {
  className?: string;
  variant?: 'default' | 'chart' | 'stats';
}

export function WidgetSkeleton({
  className,
  variant = 'default'
}: WidgetSkeletonProps): React.JSX.Element {
  return (
    <GlassCard 
      variant="dark" 
      size="lg" 
      hover="dark" 
      elevation={2}
      className={cn('h-full', className)}
    >
      {variant === 'stats' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-12 w-24" />
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      )}

      {variant === 'chart' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <Skeleton className="h-[200px] w-full" />
        </div>
      )}

      {variant === 'default' && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      )}
    </GlassCard>
  );
}
