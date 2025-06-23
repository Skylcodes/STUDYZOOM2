import * as React from 'react';
import type { Metadata } from 'next';

import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Dashboard')
};

export default function DashboardHomePage(): React.JSX.Element {
  return null; // The layout will render the ModernDashboard component
}
