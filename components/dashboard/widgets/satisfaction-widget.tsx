'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { GlassCard } from '@/components/ui/glass-card';
import { CircularProgress } from '@/components/ui/circular-progress';
import { cn } from '@/lib/utils';

export interface SatisfactionWidgetProps {
  percentage: number;
  title: string;
  subtitle: string;
  className?: string;
}

export function SatisfactionWidget({
  percentage,
  title,
  subtitle,
  className
}: SatisfactionWidgetProps): React.JSX.Element {
  return (
    <GlassCard 
      variant="dark" 
      size="lg" 
      hover="dark" 
      elevation={2}
      className={cn('h-full', className)}
    >
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress 
            percentage={percentage} 
            size={120} 
            strokeWidth={10}
            gradient
            labelClassName="text-xl font-bold"
          />
        </motion.div>
        
        <div className="text-center">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg font-semibold"
          >
            {title}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </GlassCard>
  );
}
