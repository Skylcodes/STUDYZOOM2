'use client';

import * as React from 'react';
import { useAdaptiveUI } from '@/hooks/use-adaptive-ui';
import { cn } from '@/lib/utils';

interface AdaptiveSpacingProps extends React.HTMLAttributes<HTMLDivElement> {
  // Spacing for different screen sizes
  mobileSpace?: number;
  tabletSpace?: number;
  smallDesktopSpace?: number;
  desktopSpace?: number;
  largeDesktopSpace?: number;
  
  // Direction of the spacing
  direction?: 'horizontal' | 'vertical' | 'both';
  
  // Responsive adjustments
  narrowScreenReduction?: number;
  wideScreenIncrease?: number;
  
  // Apply spacing as margin or padding
  applyAs?: 'margin' | 'padding' | 'gap';
  
  // Children
  children?: React.ReactNode;
  
  // Whether to hide on certain screen sizes
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
}

export function AdaptiveSpacing({
  className,
  mobileSpace = 4,
  tabletSpace = 8,
  smallDesktopSpace = 10,
  desktopSpace = 12,
  largeDesktopSpace = 16,
  direction = 'vertical',
  narrowScreenReduction = 0,
  wideScreenIncrease = 0,
  applyAs = 'margin',
  children,
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnDesktop = false,
  ...props
}: AdaptiveSpacingProps) {
  const { 
    isMobile, 
    isTablet, 
    isSmallDesktop, 
    isDesktop, 
    isLargeDesktop, 
    isNarrowScreen, 
    isWideScreen 
  } = useAdaptiveUI();
  
  // Check if the spacing should be hidden based on the current screen size
  if ((isMobile && hideOnMobile) || (isTablet && hideOnTablet) || (isDesktop && hideOnDesktop)) {
    return null;
  }
  
  // Determine base spacing based on screen size with more granular control
  let baseSpace = mobileSpace;
  if (isLargeDesktop) baseSpace = largeDesktopSpace;
  else if (isDesktop && !isSmallDesktop) baseSpace = desktopSpace;
  else if (isSmallDesktop) baseSpace = smallDesktopSpace;
  else if (isTablet) baseSpace = tabletSpace;
  
  // Apply adjustments for narrow/wide screens
  let currentSpace = baseSpace;
  if (isNarrowScreen && narrowScreenReduction > 0) {
    currentSpace = Math.max(0, baseSpace - narrowScreenReduction);
  } else if (isWideScreen && wideScreenIncrease > 0) {
    currentSpace = baseSpace + wideScreenIncrease;
  }
  
  // Generate spacing classes based on direction and application method
  let spacingClasses: string;
  
  if (applyAs === 'margin') {
    spacingClasses = cn(
      {
        [`space-y-${currentSpace}`]: direction === 'vertical' || direction === 'both',
        [`space-x-${currentSpace}`]: direction === 'horizontal' || direction === 'both',
      },
      className
    );
  } else if (applyAs === 'padding') {
    spacingClasses = cn(
      {
        [`py-${currentSpace}`]: direction === 'vertical' || direction === 'both',
        [`px-${currentSpace}`]: direction === 'horizontal' || direction === 'both',
        [`p-${currentSpace}`]: direction === 'both',
      },
      className
    );
  } else { // gap
    spacingClasses = cn(
      {
        [`gap-y-${currentSpace}`]: direction === 'vertical' || direction === 'both',
        [`gap-x-${currentSpace}`]: direction === 'horizontal' || direction === 'both',
        [`gap-${currentSpace}`]: direction === 'both',
      },
      className
    );
  }
  
  return (
    <div 
      className={spacingClasses} 
      data-adaptive-spacing 
      data-space={currentSpace}
      data-direction={direction}
      data-breakpoint={isLargeDesktop ? 'large-desktop' : isSmallDesktop ? 'small-desktop' : isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile'}
      {...props}
    >
      {children}
    </div>
  );
}

export default AdaptiveSpacing;
