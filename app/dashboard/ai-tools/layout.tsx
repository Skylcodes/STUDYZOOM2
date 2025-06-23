import * as React from 'react';
import type { Metadata } from 'next';

import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('AI Tools')
};

export default function AiToolsLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <div className="flex h-full flex-col">
      {children}
    </div>
  );
}
