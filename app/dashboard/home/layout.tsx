import * as React from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { InfoIcon } from 'lucide-react';

import { HomeFilters } from '@/components/dashboard/home/home-filters';
import { HomeSpinner } from '@/components/dashboard/home/home-spinner';
import { XIcon } from '@/components/ui/brand-icons';
import { buttonVariants } from '@/components/ui/button';
import { ModernDashboard } from '@/components/dashboard/modern-dashboard';
import {
  Page,
  PageActions,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageSecondaryBar,
  PageTitle
} from '@/components/ui/page';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { TransitionProvider } from '@/hooks/use-transition-context';
import { cn, createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Home')
};

// We no longer need props for the home layout as we're using the ModernDashboard component
export type HomeLayoutProps = Record<string, never>;

export default function HomeLayout(): React.JSX.Element {
  return (
    <TransitionProvider>
      <Page className="bg-gradient-background dark:bg-gradient-to-b dark:from-background dark:to-background/95 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-3xl" />
        </div>
        
        <PageHeader className="relative z-10">
          <PagePrimaryBar>
            <div className="flex flex-row items-center gap-1">
              <PageTitle>Dashboard</PageTitle>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <InfoIcon className="hidden size-3 shrink-0 text-muted-foreground sm:inline" />
                </TooltipTrigger>
                <TooltipContent>
                  Your study materials and analytics
                </TooltipContent>
              </Tooltip>
            </div>
            <PageActions>
              <Link
                href="https://github.com/achromaticlabs/pro"
                target="_blank"
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              >
                <GitHubLogoIcon className="size-4 shrink-0" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://x.com/achromaticlabs"
                target="_blank"
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              >
                <XIcon className="size-4 shrink-0" />
                <span className="sr-only">X (formerly Twitter)</span>
              </Link>
            </PageActions>
          </PagePrimaryBar>
          <PageSecondaryBar>
            <HomeFilters />
          </PageSecondaryBar>
        </PageHeader>
        <PageBody className="relative z-10">
          <ModernDashboard />
          <HomeSpinner />
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
