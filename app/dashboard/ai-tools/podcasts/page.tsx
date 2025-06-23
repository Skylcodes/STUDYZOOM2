import * as React from 'react';
import type { Metadata } from 'next';
import { MicIcon } from 'lucide-react';

import { AiToolPlaceholder } from '@/components/dashboard/ai-tools/ai-tool-placeholder';
import { Page, PageBody } from '@/components/ui/page';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Podcasts')
};

export default function PodcastsPage(): React.JSX.Element {
  return (
    <Page>
      <PageBody>
        <AiToolPlaceholder
          title="AI Podcasts"
          description="Listen to your study materials converted into audio lessons"
          icon={<MicIcon className="size-12" />}
        />
      </PageBody>
    </Page>
  );
}
