'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

export interface WelcomeWidgetProps {
  name: string;
  role: string;
  message: string;
  className?: string;
}

export function WelcomeWidget({
  name,
  role,
  message,
  className
}: WelcomeWidgetProps): React.JSX.Element {
  return (
    <GlassCard 
      variant="dark" 
      size="lg" 
      hover="dark" 
      elevation={3}
      className={cn('relative overflow-hidden', className)}
    >
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Welcome back,
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-1 text-3xl font-bold tracking-tight bg-gradient-to-r from-[#4B7BF5] to-[#9181F2] bg-clip-text text-transparent"
          >
            {name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            {role}
          </motion.p>
        </div>
        
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 inline-flex w-auto items-center rounded-lg bg-gradient-to-r from-[#4B7BF5] to-[#9181F2] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[#4B7BF5]/30 hover:scale-[1.02]"
        >
          {message}
        </motion.button>
      </div>
      
      {/* Jellyfish background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-60">
        <div className="absolute -right-20 -top-10 h-[140%] w-[140%] rounded-full bg-gradient-to-br from-[#4B7BF5]/20 via-[#9181F2]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[140%] w-[140%] rounded-full bg-gradient-to-br from-[#4B7BF5]/10 via-[#7B8CF5]/20 to-transparent blur-3xl" />
      </div>
    </GlassCard>
  );
}
