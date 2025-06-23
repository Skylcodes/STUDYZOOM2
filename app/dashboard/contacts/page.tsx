import * as React from 'react';
import { type Metadata } from 'next';
import { FileIcon, PlusIcon } from 'lucide-react';

import {
  Page,
  PageActions,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageTitle
} from '@/components/ui/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransitionProvider } from '@/hooks/use-transition-context';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Documents')
};

// Placeholder component for documents page
// This will be implemented as part of the document-centric model
export default function DocumentsPage(): React.JSX.Element {
  return (
    <TransitionProvider>
      <Page>
        <PageHeader>
          <PagePrimaryBar>
            <PageTitle>Documents</PageTitle>
            <PageActions>
              <Button size="sm">
                <PlusIcon className="mr-2 size-4" />
                Add Document
              </Button>
            </PageActions>
          </PagePrimaryBar>
        </PageHeader>
        <PageBody>
          <div className="flex min-h-[400px] items-center justify-center">
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileIcon className="mr-2 size-5" />
                  Document Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your document library is currently empty. Click the "Add Document" button to upload your first document.
                </p>
                <div className="mt-4 flex justify-center">
                  <Button>
                    <PlusIcon className="mr-2 size-4" />
                    Add Your First Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
