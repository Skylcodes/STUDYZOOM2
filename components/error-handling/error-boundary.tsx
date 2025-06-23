'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in its child component tree
 * and displays a fallback UI instead of crashing the entire application
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Update state when an error occurs
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  /**
   * Log error information when component catches an error
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Set error info in state
    this.setState({ errorInfo });
    
    // Send to error reporting service (if available)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.group('React ErrorBoundary caught an error');
      console.error(error);
      console.error('Component stack trace:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  /**
   * Reset error state and retry rendering the component
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Render error UI or children
   */
  public render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <div className="flex flex-col items-center text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We encountered an error while rendering this component. You can try refreshing the page or contact support if the issue persists.
            </p>
            
            {/* Error details (only in development) */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mb-6 w-full">
                <details className="text-left">
                  <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="p-4 bg-white dark:bg-gray-900 rounded border border-red-300 dark:border-red-700 overflow-auto max-h-[300px]">
                    <p className="font-mono text-xs text-red-600 dark:text-red-400 mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button 
                variant="default"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * Wrap a component with an ErrorBoundary
 * @param Component The component to wrap
 * @param fallback Optional custom fallback UI
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  return WrappedComponent;
}

// Add Sentry type definition
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error) => void;
    };
  }
}
