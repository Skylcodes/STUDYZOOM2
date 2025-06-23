'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

export interface ReferralWidgetProps {
  score: number;
  title: string;
  invited: number;
  clicks: number;
  className?: string;
}

export function ReferralWidget({
  score,
  title,
  invited,
  clicks,
  className
}: ReferralWidgetProps): React.JSX.Element {
  return (
    <GlassCard 
      variant="dark" 
      size="lg" 
      hover="dark" 
      elevation={2}
      className={cn('h-full', className)}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-baseline gap-1"
          >
            <span className="text-4xl font-bold">{score}</span>
            <span className="text-sm text-muted-foreground">/10</span>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg bg-surface-2/50 p-3"
          >
            <p className="text-xs text-muted-foreground">Invited</p>
            <p className="mt-1 text-lg font-semibold">{invited}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg bg-surface-2/50 p-3"
          >
            <p className="text-xs text-muted-foreground">Bonus</p>
            <p className="mt-1 text-lg font-semibold">{clicks.toLocaleString()}</p>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
