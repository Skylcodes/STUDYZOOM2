'use client';

import * as React from 'react';
import Image from 'next/image';
import { useAdaptiveUI } from '@/hooks/use-adaptive-ui';
import { cn } from '@/lib/utils';

interface AdaptiveMediaProps {
  // Source URLs for different screen sizes
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
  
  // Default source (fallback)
  src: string;
  
  // Alt text for accessibility
  alt: string;
  
  // Width and height for different screen sizes
  mobileWidth?: number;
  mobileHeight?: number;
  tabletWidth?: number;
  tabletHeight?: number;
  desktopWidth?: number;
  desktopHeight?: number;
  
  // Default width and height
  width?: number;
  height?: number;
  
  // Fill mode
  fill?: boolean;
  
  // Object fit for different screen sizes
  mobileObjectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  tabletObjectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  desktopObjectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  
  // Default object fit
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  
  // Priority loading
  priority?: boolean;
  
  // Additional classes
  className?: string;
  
  // Border radius for different screen sizes
  mobileBorderRadius?: string;
  tabletBorderRadius?: string;
  desktopBorderRadius?: string;
  
  // Default border radius
  borderRadius?: string;
}

export function AdaptiveMedia({
  mobileSrc,
  tabletSrc,
  desktopSrc,
  src,
  alt,
  mobileWidth,
  mobileHeight,
  tabletWidth,
  tabletHeight,
  desktopWidth,
  desktopHeight,
  width,
  height,
  fill = false,
  mobileObjectFit,
  tabletObjectFit,
  desktopObjectFit,
  objectFit = 'cover',
  priority = false,
  className,
  mobileBorderRadius,
  tabletBorderRadius,
  desktopBorderRadius,
  borderRadius = '0',
}: AdaptiveMediaProps) {
  const { isMobile, isTablet, isDesktop } = useAdaptiveUI();
  
  // Determine current properties based on screen size
  const currentSrc = isMobile && mobileSrc 
    ? mobileSrc 
    : isTablet && tabletSrc 
      ? tabletSrc 
      : isDesktop && desktopSrc 
        ? desktopSrc 
        : src;
  
  const currentWidth = isMobile && mobileWidth 
    ? mobileWidth 
    : isTablet && tabletWidth 
      ? tabletWidth 
      : isDesktop && desktopWidth 
        ? desktopWidth 
        : width;
  
  const currentHeight = isMobile && mobileHeight 
    ? mobileHeight 
    : isTablet && tabletHeight 
      ? tabletHeight 
      : isDesktop && desktopHeight 
        ? desktopHeight 
        : height;
  
  const currentObjectFit = isMobile && mobileObjectFit 
    ? mobileObjectFit 
    : isTablet && tabletObjectFit 
      ? tabletObjectFit 
      : isDesktop && desktopObjectFit 
        ? desktopObjectFit 
        : objectFit;
  
  const currentBorderRadius = isMobile && mobileBorderRadius 
    ? mobileBorderRadius 
    : isTablet && tabletBorderRadius 
      ? tabletBorderRadius 
      : isDesktop && desktopBorderRadius 
        ? desktopBorderRadius 
        : borderRadius;
  
  // Style for object-fit and border-radius
  const style = {
    objectFit: currentObjectFit,
    borderRadius: currentBorderRadius,
  } as React.CSSProperties;
  
  return (
    <div className={cn('relative', className)} style={{ borderRadius: currentBorderRadius }}>
      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : currentWidth}
        height={fill ? undefined : currentHeight}
        fill={fill}
        style={style}
        priority={priority}
        className="transition-all duration-300"
      />
    </div>
  );
}

export default AdaptiveMedia;
