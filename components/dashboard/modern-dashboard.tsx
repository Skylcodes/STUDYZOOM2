'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { StatCard } from '@/components/dashboard/widgets/stat-card';
import { WelcomeWidget } from '@/components/dashboard/widgets/welcome-widget';
import { SatisfactionWidget } from '@/components/dashboard/widgets/satisfaction-widget';
import { ReferralWidget } from '@/components/dashboard/widgets/referral-widget';
import { ActiveUsersWidget } from '@/components/dashboard/widgets/active-users-widget';
import { SalesOverviewWidget } from '@/components/dashboard/widgets/sales-overview-widget';
import { 
  mockStats, 
  mockSatisfactionRate, 
  mockReferralTracking, 
  mockActiveUsers, 
  mockSalesOverview,
  mockUser
} from '@/constants/dashboard-mock';

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

export function ModernDashboard(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {mockStats.map((stat) => (
          <motion.div key={stat.id} variants={item}>
            <StatCard
              title={stat.title}
              value={stat.value}
              delta={stat.delta}
              icon={stat.icon}
            />
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
          <WelcomeWidget
            name={mockUser.name}
            role={mockUser.role}
            message={mockUser.message}
            className="h-full"
          />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-1">
          <SatisfactionWidget
            percentage={mockSatisfactionRate.percentage}
            title={mockSatisfactionRate.title}
            subtitle={mockSatisfactionRate.subtitle}
            className="h-full"
          />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-1">
          <ReferralWidget
            score={mockReferralTracking.score}
            title={mockReferralTracking.title}
            invited={mockReferralTracking.invited}
            clicks={mockReferralTracking.clicks}
            className="h-full"
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <motion.div variants={item} className="lg:col-span-1">
          <ActiveUsersWidget
            total={mockActiveUsers.total}
            clicks={mockActiveUsers.clicks}
            sales={mockActiveUsers.sales}
            items={mockActiveUsers.items}
            chartData={mockActiveUsers.chartData}
            className="h-full"
          />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <SalesOverviewWidget
            title={mockSalesOverview.title}
            period={mockSalesOverview.period}
            data={mockSalesOverview.data}
            className="h-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
