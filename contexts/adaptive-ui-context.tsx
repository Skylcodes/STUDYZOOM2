'use client';

import * as React from 'react';
import { useAdaptiveUI, AdaptiveUIState } from '@/hooks/use-adaptive-ui';

// Create context with default values
const AdaptiveUIContext = React.createContext<AdaptiveUIState | undefined>(undefined);

export function AdaptiveUIProvider({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const adaptiveUI = useAdaptiveUI();

  return (
    <AdaptiveUIContext.Provider value={adaptiveUI}>
      {children}
    </AdaptiveUIContext.Provider>
  );
}

// Custom hook to use the adaptive UI context
export function useAdaptiveUIContext(): AdaptiveUIState {
  const context = React.useContext(AdaptiveUIContext);
  
  if (context === undefined) {
    throw new Error('useAdaptiveUIContext must be used within an AdaptiveUIProvider');
  }
  
  return context;
}

export default AdaptiveUIContext;
