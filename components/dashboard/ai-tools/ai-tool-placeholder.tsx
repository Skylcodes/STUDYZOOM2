'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

export interface AiToolPlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function AiToolPlaceholder({
  title,
  description,
  icon,
  className
}: AiToolPlaceholderProps): React.JSX.Element {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </motion.div>

      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-1 md:col-span-2"
        >
          <GlassCard
            variant="gradient"
            hover="gradient"
            glow
            className={cn('flex h-full flex-col items-center justify-center p-8', className)}
          >
            <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
            <h2 className="mb-2 text-2xl font-semibold">Coming Soon</h2>
            <p className="max-w-md text-center text-muted-foreground">
              This feature is currently in development and will be available soon. Stay tuned for updates!
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
