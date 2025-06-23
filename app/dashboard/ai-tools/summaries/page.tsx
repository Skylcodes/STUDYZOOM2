import * as React from 'react';
import type { Metadata } from 'next';
import { BookOpenIcon } from 'lucide-react';

import { AiToolPlaceholder } from '@/components/dashboard/ai-tools/ai-tool-placeholder';
import { Page, PageBody } from '@/components/ui/page';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Summaries')
};

export default function SummariesPage(): React.JSX.Element {
  return (
    <Page>
      <PageBody>
        <AiToolPlaceholder
          title="AI Summaries"
          description="Get concise, easy-to-read bullet-point summaries of your study materials"
          icon={<BookOpenIcon className="size-12" />}
        />
      </PageBody>
    </Page>
  );
}
