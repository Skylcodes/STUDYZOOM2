'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';

import { Button } from '@/components/ui/button';
import { Routes } from '@/constants/routes';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error page for the StudyZoom application
 * This catches errors that occur during rendering and provides a user-friendly fallback
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Report the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#1a1a2e] to-[#1e1b3b] p-4 text-white">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 flex max-w-md flex-col items-center rounded-lg border border-slate-700/50 bg-slate-900/70 p-8 text-center backdrop-blur-sm">
        <div className="mb-6 rounded-full bg-red-900/30 p-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
        
        <p className="mb-6 text-slate-300">
          We've encountered an unexpected error. Our team has been notified and is working to fix the issue.
        </p>
        
        {/* Show error message in development only */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 w-full overflow-auto rounded bg-slate-800 p-4 text-left">
            <p className="text-sm font-mono text-red-400">{error.message}</p>
            {error.digest && (
              <p className="mt-2 text-xs font-mono text-slate-400">Error ID: {error.digest}</p>
            )}
          </div>
        )}
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          
          <Button asChild variant="outline">
            <Link href={Routes.Dashboard}>
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
