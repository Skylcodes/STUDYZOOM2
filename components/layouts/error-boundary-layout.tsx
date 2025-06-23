import React, { ReactNode } from 'react';
import ErrorBoundary from '@/components/error-handling/error-boundary';

interface ErrorBoundaryLayoutProps {
  children: ReactNode;
}

/**
 * A layout wrapper that adds error boundary protection to any content
 * This helps prevent the entire application from crashing when errors occur in specific components
 */
export function ErrorBoundaryLayout({ children }: ErrorBoundaryLayoutProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export default ErrorBoundaryLayout;
