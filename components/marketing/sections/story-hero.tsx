import * as React from 'react';

import { GridSection } from '@/components/marketing/fragments/grid-section';
import { SiteHeading } from '@/components/marketing/fragments/site-heading';

export function StoryHero(): React.JSX.Element {
  return (
    <GridSection hideVerticalGridLines>
      <div className="container relative py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="space-y-4 mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-sm font-medium text-primary">
              About Us
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Premium Boilerplates{' '}
              <span className="bg-gradient-to-r from-[#4B7BF5] via-[#9181F2] to-[#4B7BF5] bg-clip-text text-transparent">
                Unbeatable Prices
              </span>
            </h1>
          </div>
        </div>
      </div>
    </GridSection>
  );
}
