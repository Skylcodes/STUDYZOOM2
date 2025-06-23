import * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder component for frequently accessed documents
// This will be implemented as part of the document-centric model
export default function FrequentlyAccessedDocumentsPage(): React.JSX.Element {
  return (
    <Card className="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Frequently Accessed Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your most frequently accessed documents will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
