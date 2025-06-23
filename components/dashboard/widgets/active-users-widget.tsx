'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface ChartData {
  name: string;
  value: number;
}

export interface ActiveUsersWidgetProps {
  total: number;
  clicks: number;
  sales: number;
  items: number;
  chartData: ChartData[];
  className?: string;
}

export function ActiveUsersWidget({
  total,
  clicks,
  sales,
  items,
  chartData,
  className
}: ActiveUsersWidgetProps): React.JSX.Element {
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
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold">Active Users</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="text-emerald-500">+23%</span> than last week
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 h-[120px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={12}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <Tooltip 
                  cursor={false}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--surface-2))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 grid grid-cols-4 gap-2"
        >
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">Users</p>
            <p className="mt-1 text-sm font-medium">{total.toLocaleString()}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">Clicks</p>
            <p className="mt-1 text-sm font-medium">{clicks.toLocaleString()}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">Sales</p>
            <p className="mt-1 text-sm font-medium">{sales.toLocaleString()}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">Items</p>
            <p className="mt-1 text-sm font-medium">{items.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
}
