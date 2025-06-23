import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface LazyPDFViewerProps {
  url: string;
  title: string;
  className?: string;
  height?: number | string;
}

/**
 * A component that lazily loads PDF documents only when they enter the viewport
 * Improves performance by deferring the loading of potentially large PDF files
 */
export function LazyPDFViewer({
  url,
  title,
  className = '',
  height = 600
}: LazyPDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [manualLoad, setManualLoad] = useState(false);
  
  // Use intersection observer to detect when the component is in view
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Start loading when in view or when manually triggered
  useEffect(() => {
    if (inView || manualLoad) {
      setShouldLoad(true);
    }
  }, [inView, manualLoad]);

  // Handle PDF loading events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      ref={ref}
      className={`relative rounded-lg border border-slate-700 bg-slate-800 ${className}`}
      style={{ height }}
    >
      {!shouldLoad ? (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
          <FileText className="mb-4 h-12 w-12 text-slate-400" />
          <h3 className="mb-2 text-lg font-medium text-slate-200">{title}</h3>
          <p className="mb-4 text-sm text-slate-400">PDF will load automatically when scrolled into view</p>
          <Button 
            variant="outline" 
            onClick={() => setManualLoad(true)}
          >
            Load PDF Now
          </Button>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 backdrop-blur-sm">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-slate-300">Loading PDF...</p>
            </div>
          )}
          
          {hasError ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <FileText className="mb-4 h-12 w-12 text-red-400" />
              <h3 className="mb-2 text-lg font-medium text-slate-200">Failed to load PDF</h3>
              <p className="mb-4 text-sm text-slate-400">There was an error loading this document</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  // Force reload by toggling shouldLoad
                  setShouldLoad(false);
                  setTimeout(() => setShouldLoad(true), 100);
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <iframe
              src={`${url}#toolbar=0&navpanes=0`}
              title={title}
              className="h-full w-full rounded-lg"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </>
      )}
    </div>
  );
}
