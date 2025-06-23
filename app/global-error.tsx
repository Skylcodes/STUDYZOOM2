'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppInfo } from '@/constants/app-info';

export type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Global error handler for Next.js application
 * Catches and displays server-side errors gracefully
 */
export default function GlobalError(
  props: GlobalErrorProps
): React.JSX.Element {
  const { error, reset } = props;
  
  // Log error to console in development
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.group('Global error caught:');
      console.error(error);
      console.groupEnd();
    }
    
    // Send to error reporting service if available
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error);
    }
    
    // We would use our application logger here, but it's server-side only
    // and this component runs on the client
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900 p-3 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-300" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're sorry, but we encountered an unexpected error.
                Our team has been notified and is working to fix the issue.
              </p>
              
              {/* Error details (only in development) */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="mb-6 w-full">
                  <details className="text-left">
                    <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded border border-red-300 dark:border-red-700 overflow-auto max-h-[300px]">
                      <p className="font-mono text-xs text-red-600 dark:text-red-400 mb-2">
                        {error.name}: {error.message}
                      </p>
                      {error.stack && (
                        <pre className="font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      )}
                      {error.digest && (
                        <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Error Digest: {error.digest}
                        </p>
                      )}
                    </div>
                  </details>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => reset()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => window.location.href = '/'}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Return Home
                </Button>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} {AppInfo.APP_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

// Add Sentry type definition
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error) => void;
    };
  }
}
