import * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder component for document statistics
// This will be implemented as part of the document-centric model
export default function DocumentStatisticsPage(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your document statistics and analytics will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
