'use client';

import * as React from 'react';
import { useAdaptiveUI } from '@/hooks/use-adaptive-ui';
import { cn } from '@/lib/utils';

interface AdaptiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  // Container width for different screen sizes
  mobileWidth?: 'full' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  tabletWidth?: 'full' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  smallDesktopWidth?: 'full' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'; // Added for more precise control
  desktopWidth?: 'full' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  largeDesktopWidth?: 'full' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'; // Added for more precise control
  
  // Padding for different screen sizes
  mobilePaddingX?: number;
  mobilePaddingY?: number;
  tabletPaddingX?: number;
  tabletPaddingY?: number;
  smallDesktopPaddingX?: number; // Added for more precise control
  smallDesktopPaddingY?: number; // Added for more precise control
  desktopPaddingX?: number;
  desktopPaddingY?: number;
  largeDesktopPaddingX?: number; // Added for more precise control
  largeDesktopPaddingY?: number; // Added for more precise control
  
  // Margin for different screen sizes
  mobileMarginX?: number;
  mobileMarginY?: number;
  tabletMarginX?: number;
  tabletMarginY?: number;
  smallDesktopMarginX?: number; // Added for more precise control
  smallDesktopMarginY?: number; // Added for more precise control
  desktopMarginX?: number;
  desktopMarginY?: number;
  largeDesktopMarginX?: number; // Added for more precise control
  largeDesktopMarginY?: number; // Added for more precise control
  
  // Max width for different screen sizes
  mobileMaxWidth?: string;
  tabletMaxWidth?: string;
  smallDesktopMaxWidth?: string; // Added for more precise control
  desktopMaxWidth?: string;
  largeDesktopMaxWidth?: string; // Added for more precise control
  
  // Additional responsive properties
  narrowScreenAdjustment?: boolean; // Adjust layout for narrow screens
  wideScreenAdjustment?: boolean; // Adjust layout for wide screens
  
  // Children
  children: React.ReactNode;
}

export function AdaptiveContainer({
  className,
  mobileWidth = 'full',
  tabletWidth = 'lg',
  smallDesktopWidth = 'lg',
  desktopWidth = 'xl',
  largeDesktopWidth = '2xl',
  mobilePaddingX = 4,
  mobilePaddingY = 4,
  tabletPaddingX = 6,
  tabletPaddingY = 6,
  smallDesktopPaddingX = 6,
  smallDesktopPaddingY = 6,
  desktopPaddingX = 8,
  desktopPaddingY = 8,
  largeDesktopPaddingX = 8,
  largeDesktopPaddingY = 8,
  mobileMarginX = 0,
  mobileMarginY = 0,
  tabletMarginX = 0,
  tabletMarginY = 0,
  smallDesktopMarginX = 0,
  smallDesktopMarginY = 0,
  desktopMarginX = 0,
  desktopMarginY = 0,
  largeDesktopMarginX = 0,
  largeDesktopMarginY = 0,
  mobileMaxWidth,
  tabletMaxWidth,
  smallDesktopMaxWidth,
  desktopMaxWidth,
  largeDesktopMaxWidth,
  narrowScreenAdjustment = false,
  wideScreenAdjustment = false,
  children,
  ...props
}: AdaptiveContainerProps) {
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    isSmallDesktop, 
    isLargeDesktop, 
    isNarrowScreen, 
    isWideScreen 
  } = useAdaptiveUI();
  
  // Determine current properties based on screen size with more granular control
  let currentWidth = mobileWidth;
  if (isLargeDesktop) currentWidth = largeDesktopWidth;
  else if (isDesktop && !isSmallDesktop) currentWidth = desktopWidth;
  else if (isSmallDesktop) currentWidth = smallDesktopWidth;
  else if (isTablet) currentWidth = tabletWidth;
  
  let currentPaddingX = mobilePaddingX;
  if (isLargeDesktop) currentPaddingX = largeDesktopPaddingX;
  else if (isDesktop && !isSmallDesktop) currentPaddingX = desktopPaddingX;
  else if (isSmallDesktop) currentPaddingX = smallDesktopPaddingX;
  else if (isTablet) currentPaddingX = tabletPaddingX;
  
  let currentPaddingY = mobilePaddingY;
  if (isLargeDesktop) currentPaddingY = largeDesktopPaddingY;
  else if (isDesktop && !isSmallDesktop) currentPaddingY = desktopPaddingY;
  else if (isSmallDesktop) currentPaddingY = smallDesktopPaddingY;
  else if (isTablet) currentPaddingY = tabletPaddingY;
  
  let currentMarginX = mobileMarginX;
  if (isLargeDesktop) currentMarginX = largeDesktopMarginX;
  else if (isDesktop && !isSmallDesktop) currentMarginX = desktopMarginX;
  else if (isSmallDesktop) currentMarginX = smallDesktopMarginX;
  else if (isTablet) currentMarginX = tabletMarginX;
  
  let currentMarginY = mobileMarginY;
  if (isLargeDesktop) currentMarginY = largeDesktopMarginY;
  else if (isDesktop && !isSmallDesktop) currentMarginY = desktopMarginY;
  else if (isSmallDesktop) currentMarginY = smallDesktopMarginY;
  else if (isTablet) currentMarginY = tabletMarginY;
  
  let currentMaxWidth = undefined;
  if (isLargeDesktop && largeDesktopMaxWidth) currentMaxWidth = largeDesktopMaxWidth;
  else if (isDesktop && !isSmallDesktop && desktopMaxWidth) currentMaxWidth = desktopMaxWidth;
  else if (isSmallDesktop && smallDesktopMaxWidth) currentMaxWidth = smallDesktopMaxWidth;
  else if (isTablet && tabletMaxWidth) currentMaxWidth = tabletMaxWidth;
  else if (isMobile && mobileMaxWidth) currentMaxWidth = mobileMaxWidth;
  
  // Apply additional adjustments for narrow or wide screens if enabled
  if (narrowScreenAdjustment && isNarrowScreen) {
    // Reduce padding for narrow screens
    currentPaddingX = Math.max(2, currentPaddingX - 2);
    currentWidth = 'full';
  }
  
  if (wideScreenAdjustment && isWideScreen) {
    // Increase max-width for wide screens to use more space
    if (currentMaxWidth && !currentMaxWidth.includes('%')) {
      const numericPart = parseInt(currentMaxWidth);
      if (!isNaN(numericPart)) {
        const unit = currentMaxWidth.replace(numericPart.toString(), '');
        currentMaxWidth = `${Math.round(numericPart * 1.1)}${unit}`;
      }
    }
  }
  
  // Generate container width class
  const containerWidthClass = currentWidth === 'none' 
    ? '' 
    : currentWidth === 'full' 
      ? 'w-full' 
      : `container-${currentWidth}`;
  
  // Generate padding classes
  const paddingClasses = `px-${currentPaddingX} py-${currentPaddingY}`;
  
  // Generate margin classes
  const marginClasses = `mx-${currentMarginX} my-${currentMarginY}`;
  
  // Combine all classes
  const containerClasses = cn(
    containerWidthClass,
    paddingClasses,
    marginClasses,
    'transition-all duration-300',
    className
  );
  
  // Style object with enhanced properties
  const style: React.CSSProperties = {
    transition: 'all 0.3s ease-in-out',
    ...(currentMaxWidth ? { maxWidth: currentMaxWidth } : {})
  };
  
  return (
    <div 
      className={containerClasses} 
      style={style} 
      data-adaptive-container 
      data-breakpoint={isLargeDesktop ? 'large-desktop' : isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile'}
      {...props}
    >
      {children}
    </div>
  );
}

export default AdaptiveContainer;
