import * as React from 'react';
import type { Metadata } from 'next';
import { MessageSquareIcon } from 'lucide-react';

import { AiToolPlaceholder } from '@/components/dashboard/ai-tools/ai-tool-placeholder';
import { Page, PageBody } from '@/components/ui/page';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Document Chat')
};

export default function DocumentChatPage(): React.JSX.Element {
  return (
    <Page>
      <PageBody>
        <AiToolPlaceholder
          title="Document Chat"
          description="Chat with your documents and get instant answers to your questions"
          icon={<MessageSquareIcon className="size-12" />}
        />
      </PageBody>
    </Page>
  );
}
