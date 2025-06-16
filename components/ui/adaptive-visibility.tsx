'use client';

import * as React from 'react';
import { useAdaptiveUI } from '@/hooks/use-adaptive-ui';
import { cn } from '@/lib/utils';

interface AdaptiveVisibilityProps extends React.HTMLAttributes<HTMLDivElement> {
  // Visibility for different screen sizes
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnSmallDesktop?: boolean;
  showOnDesktop?: boolean;
  showOnLargeDesktop?: boolean;
  
  // Special conditions
  showOnNarrowScreen?: boolean;
  showOnWideScreen?: boolean;
  hideOnNarrowScreen?: boolean;
  hideOnWideScreen?: boolean;
  
  // Fade transition instead of hard visibility change
  useFadeTransition?: boolean;
  transitionDuration?: number;
  
  // Children
  children: React.ReactNode;
  
  // Whether to render as a span (inline) or div (block)
  as?: 'span' | 'div';
  
  // Additional classes
  className?: string;
}

export function AdaptiveVisibility({
  className,
  showOnMobile = true,
  showOnTablet = true,
  showOnSmallDesktop = true,
  showOnDesktop = true,
  showOnLargeDesktop = true,
  showOnNarrowScreen,
  showOnWideScreen,
  hideOnNarrowScreen,
  hideOnWideScreen,
  useFadeTransition = false,
  transitionDuration = 300,
  children,
  as = 'div',
  ...props
}: AdaptiveVisibilityProps) {
  const { 
    isMobile, 
    isTablet, 
    isSmallDesktop, 
    isDesktop, 
    isLargeDesktop, 
    isNarrowScreen, 
    isWideScreen 
  } = useAdaptiveUI();
  
  // Determine if the component should be visible based on screen size
  let isVisible = false;
  
  if (isMobile && showOnMobile) isVisible = true;
  else if (isTablet && showOnTablet) isVisible = true;
  else if (isSmallDesktop && showOnSmallDesktop) isVisible = true;
  else if (isDesktop && !isSmallDesktop && !isLargeDesktop && showOnDesktop) isVisible = true;
  else if (isLargeDesktop && showOnLargeDesktop) isVisible = true;
  
  // Apply special conditions for narrow/wide screens
  if (isNarrowScreen) {
    if (hideOnNarrowScreen) isVisible = false;
    if (showOnNarrowScreen) isVisible = true;
  }
  
  if (isWideScreen) {
    if (hideOnWideScreen) isVisible = false;
    if (showOnWideScreen) isVisible = true;
  }
  
  // If not visible and not using fade transition, don't render anything
  if (!isVisible && !useFadeTransition) {
    return null;
  }
  
  // If using fade transition, apply opacity styles
  const style: React.CSSProperties = useFadeTransition 
    ? { 
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${transitionDuration}ms ease-in-out`,
        pointerEvents: isVisible ? 'auto' : 'none'
      } 
    : {};
  
  const Component = as;
  
  return (
    <Component 
      className={cn(className)} 
      style={style}
      data-adaptive-visibility 
      data-visible={isVisible}
      data-breakpoint={isLargeDesktop ? 'large-desktop' : isSmallDesktop ? 'small-desktop' : isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile'}
      {...props}
    >
      {children}
    </Component>
  );
}

export default AdaptiveVisibility;
