import * as React from 'react';
import type { Metadata } from 'next';
import { StickyNoteIcon } from 'lucide-react';

import { AiToolPlaceholder } from '@/components/dashboard/ai-tools/ai-tool-placeholder';
import { Page, PageBody } from '@/components/ui/page';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Flashcards')
};

export default function FlashcardsPage(): React.JSX.Element {
  return (
    <Page>
      <PageBody>
        <AiToolPlaceholder
          title="AI Flashcards"
          description="Automatically generated flashcards from your study materials"
          icon={<StickyNoteIcon className="size-12" />}
        />
      </PageBody>
    </Page>
  );
}
