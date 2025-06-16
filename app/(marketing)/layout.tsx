import * as React from 'react';

import { Footer } from '@/components/marketing/footer';
import { CookieBanner } from '@/components/marketing/fragments/cookie-banner';
import { Navbar } from '@/components/marketing/navbar';

export default function MarketingLayout(
  props: React.PropsWithChildren
): React.JSX.Element {
  return (
    <div className="min-h-screen w-full flex flex-col relative">
      <Navbar />
      <div className="flex-1 relative">{props.children}</div>
      <Footer />
      <CookieBanner />
    </div>
  );
}
