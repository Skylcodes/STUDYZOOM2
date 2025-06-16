import * as React from 'react';

import { EnterpriseFeatures } from '@/components/marketing/sections/enterprise-features';
import { FAQ } from '@/components/marketing/sections/faq';
import { Features } from '@/components/marketing/sections/features';
import { FeatureComparison } from '@/components/marketing/sections/feature-comparison';
import { Hero } from '@/components/marketing/sections/hero';
import { PricingUI } from '@/components/marketing/sections/pricing-ui';
import { RealResults } from '@/components/marketing/sections/real-results';
import { Reviews } from '@/components/marketing/sections/reviews';

export default function IndexPage(): React.JSX.Element {
  return (
    <main className="w-full flex flex-col items-center">
      <Hero />
      <EnterpriseFeatures />
      <Features />
      <RealResults />
      <FeatureComparison />
      <Reviews />
      <PricingUI />
      <FAQ />
    </main>
  );
}
