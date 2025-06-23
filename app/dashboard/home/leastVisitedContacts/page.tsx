import * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder component for least visited documents
// This will be implemented as part of the document-centric model
export default function LeastVisitedDocumentsPage(): React.JSX.Element {
  return (
    <Card className="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Recently Added Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your recently added documents will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
