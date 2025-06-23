import React, { useState } from 'react';
import Image from 'next/image';
import { FileText, FileImage, FilePresentation, File } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LazyDocumentThumbnailProps {
  src?: string | null;
  documentType: string;
  title: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * A component that lazily loads document thumbnails with appropriate fallbacks
 * Improves performance by only loading images when they enter the viewport
 */
export function LazyDocumentThumbnail({
  src,
  documentType,
  title,
  className,
  width = 200,
  height = 150
}: LazyDocumentThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Determine the appropriate icon based on document type
  const getDocumentIcon = () => {
    switch (documentType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-400" />;
      case 'image':
        return <FileImage className="h-12 w-12 text-blue-400" />;
      case 'presentation':
        return <FilePresentation className="h-12 w-12 text-amber-400" />;
      default:
        return <File className="h-12 w-12 text-slate-400" />;
    }
  };

  // Show fallback if no source or error loading
  if (!src || hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center rounded-md border border-slate-700 bg-slate-800",
          className
        )}
        style={{ width, height }}
      >
        {getDocumentIcon()}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-md border border-slate-700 bg-slate-800",
        className
      )}
      style={{ width, height }}
    >
      {/* Fallback shown while image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          {getDocumentIcon()}
        </div>
      )}
      
      <Image
        src={src}
        alt={title}
        width={width}
        height={height}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy" // Use native lazy loading
        sizes={`(max-width: 768px) 100vw, ${width}px`}
      />
    </div>
  );
}
