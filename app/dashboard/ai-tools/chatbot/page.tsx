import * as React from 'react';
import type { Metadata } from 'next';
import { BrainIcon } from 'lucide-react';

import { AiToolPlaceholder } from '@/components/dashboard/ai-tools/ai-tool-placeholder';
import { Page, PageBody } from '@/components/ui/page';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('AI Study Buddy')
};

export default function AiChatbotPage(): React.JSX.Element {
  return (
    <Page>
      <PageBody>
        <AiToolPlaceholder
          title="AI Study Buddy"
          description="Your intelligent study assistant powered by AI"
          icon={<BrainIcon className="size-12" />}
        />
      </PageBody>
    </Page>
  );
}
