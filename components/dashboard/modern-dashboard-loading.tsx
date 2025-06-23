'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { WidgetSkeleton } from '@/components/dashboard/widgets/widget-skeleton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ModernDashboardLoading(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div key={index} variants={item}>
            <WidgetSkeleton variant="stats" className="h-[120px]" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <motion.div variants={item} className="lg:col-span-1">
          <WidgetSkeleton className="h-[260px]" />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-1">
          <WidgetSkeleton className="h-[260px]" />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-1">
          <WidgetSkeleton className="h-[260px]" />
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <motion.div variants={item} className="lg:col-span-1">
          <WidgetSkeleton variant="stats" className="h-[320px]" />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <WidgetSkeleton variant="chart" className="h-[320px]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
