'use client';

import * as React from 'react';
import { useAdaptiveUI, Breakpoint } from '@/hooks/use-adaptive-ui';
import { cn } from '@/lib/utils';

interface AdaptiveLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  // Different layouts for different breakpoints
  mobileLayout?: 'stack' | 'grid' | 'flex' | 'hidden';
  tabletLayout?: 'stack' | 'grid' | 'flex' | 'hidden';
  desktopLayout?: 'stack' | 'grid' | 'flex' | 'hidden';
  
  // Grid/flex properties that can change based on breakpoint
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  
  // Gap sizes
  mobileGap?: number;
  tabletGap?: number;
  desktopGap?: number;
  
  // Padding
  mobilePadding?: string;
  tabletPadding?: string;
  desktopPadding?: string;
  
  // Alignment
  mobileAlign?: 'start' | 'center' | 'end' | 'stretch';
  tabletAlign?: 'start' | 'center' | 'end' | 'stretch';
  desktopAlign?: 'start' | 'center' | 'end' | 'stretch';
  
  // Direction for flex layouts
  mobileDirection?: 'row' | 'column';
  tabletDirection?: 'row' | 'column';
  desktopDirection?: 'row' | 'column';
  
  // Wrap behavior for flex layouts
  mobileWrap?: boolean;
  tabletWrap?: boolean;
  desktopWrap?: boolean;
  
  // Children
  children: React.ReactNode;
}

export function AdaptiveLayout({
  className,
  mobileLayout = 'stack',
  tabletLayout = 'stack',
  desktopLayout = 'stack',
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 4,
  mobileGap = 4,
  tabletGap = 6,
  desktopGap = 8,
  mobilePadding = '1rem',
  tabletPadding = '1.5rem',
  desktopPadding = '2rem',
  mobileAlign = 'start',
  tabletAlign = 'start',
  desktopAlign = 'start',
  mobileDirection = 'column',
  tabletDirection = 'row',
  desktopDirection = 'row',
  mobileWrap = false,
  tabletWrap = true,
  desktopWrap = true,
  children,
  ...props
}: AdaptiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useAdaptiveUI();
  
  // Determine current layout properties based on screen size
  const currentLayout = isMobile ? mobileLayout : isTablet ? tabletLayout : desktopLayout;
  const currentColumns = isMobile ? mobileColumns : isTablet ? tabletColumns : desktopColumns;
  const currentGap = isMobile ? mobileGap : isTablet ? tabletGap : desktopGap;
  const currentPadding = isMobile ? mobilePadding : isTablet ? tabletPadding : desktopPadding;
  const currentAlign = isMobile ? mobileAlign : isTablet ? tabletAlign : desktopAlign;
  const currentDirection = isMobile ? mobileDirection : isTablet ? tabletDirection : desktopDirection;
  const currentWrap = isMobile ? mobileWrap : isTablet ? tabletWrap : desktopWrap;
  
  // If layout is hidden, don't render anything
  if (currentLayout === 'hidden') {
    return null;
  }
  
  // Generate classes based on current layout
  const layoutClasses = cn(
    {
      'flex': currentLayout === 'flex',
      'grid': currentLayout === 'grid',
      'flex flex-col': currentLayout === 'stack',
      [`grid-cols-${currentColumns}`]: currentLayout === 'grid',
      [`gap-${currentGap}`]: true,
      'flex-wrap': currentLayout === 'flex' && currentWrap,
      'flex-nowrap': currentLayout === 'flex' && !currentWrap,
      'flex-row': currentLayout === 'flex' && currentDirection === 'row',
      'flex-col': (currentLayout === 'flex' && currentDirection === 'column') || currentLayout === 'stack',
      'items-start': currentAlign === 'start',
      'items-center': currentAlign === 'center',
      'items-end': currentAlign === 'end',
      'items-stretch': currentAlign === 'stretch',
    },
    className
  );
  
  const style = {
    padding: currentPadding,
  };
  
  return (
    <div className={layoutClasses} style={style} {...props}>
      {children}
    </div>
  );
}

export default AdaptiveLayout;
