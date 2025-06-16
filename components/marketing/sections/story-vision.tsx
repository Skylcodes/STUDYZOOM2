import * as React from 'react';

import { GridSection } from '@/components/marketing/fragments/grid-section';

export function StoryVision(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container max-w-6xl py-20">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-sm font-medium text-primary">
              Our Approach
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Conversion-Optimized UI
            </h2>
            <div className="space-y-6 text-base text-muted-foreground md:text-lg">
              <p>
                Most boilerplates focus solely on code structure, but our templates are built with
                conversion optimization as the priority. We've meticulously designed every element to
                guide users toward action, turning visitors into customers more effectively.
              </p>
              <p>
                You'll get all the premium features found in expensive alternatives at a fraction of the price,
                with UI patterns specifically designed to boost conversions and generate real revenue—not
                just look impressive.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 to-primary/10 p-8 shadow-lg">
            <div className="relative z-10 space-y-6">
              {[
                {
                  title: 'Higher Conversions',
                  description:
                    'UI patterns proven to drive more signups, purchases, and user engagement.'
                },
                {
                  title: 'Premium Value',
                  description:
                    'All the features of high-end boilerplates at a significantly lower price.'
                },
                {
                  title: 'Engaging Animations',
                  description:
                    'Subtle micro-interactions and animations that increase user engagement and retention.'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </div>
      </div>
    </GridSection>
  );
}
