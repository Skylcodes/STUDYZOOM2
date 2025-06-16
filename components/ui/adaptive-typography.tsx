'use client';

import * as React from 'react';
import { useAdaptiveUI } from '@/hooks/use-adaptive-ui';
import { cn } from '@/lib/utils';

interface AdaptiveTypographyProps {
  // Content
  children: React.ReactNode;
  
  // Element type
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  
  // Font sizes for different screen sizes (using Tailwind classes)
  mobileFontSize?: string;
  tabletFontSize?: string;
  desktopFontSize?: string;
  
  // Line heights for different screen sizes (using Tailwind classes)
  mobileLineHeight?: string;
  tabletLineHeight?: string;
  desktopLineHeight?: string;
  
  // Font weights for different screen sizes (using Tailwind classes)
  mobileFontWeight?: string;
  tabletFontWeight?: string;
  desktopFontWeight?: string;
  
  // Text alignment for different screen sizes
  mobileTextAlign?: 'left' | 'center' | 'right' | 'justify';
  tabletTextAlign?: 'left' | 'center' | 'right' | 'justify';
  desktopTextAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Text colors for different screen sizes
  mobileTextColor?: string;
  tabletTextColor?: string;
  desktopTextColor?: string;
  
  // Letter spacing for different screen sizes
  mobileLetterSpacing?: string;
  tabletLetterSpacing?: string;
  desktopLetterSpacing?: string;
  
  // Additional classes
  className?: string;
}

export function AdaptiveTypography({
  children,
  as = 'p',
  mobileFontSize = 'text-base',
  tabletFontSize = 'text-lg',
  desktopFontSize = 'text-xl',
  mobileLineHeight = 'leading-normal',
  tabletLineHeight = 'leading-normal',
  desktopLineHeight = 'leading-normal',
  mobileFontWeight = 'font-normal',
  tabletFontWeight = 'font-normal',
  desktopFontWeight = 'font-normal',
  mobileTextAlign = 'left',
  tabletTextAlign = 'left',
  desktopTextAlign = 'left',
  mobileTextColor,
  tabletTextColor,
  desktopTextColor,
  mobileLetterSpacing = 'tracking-normal',
  tabletLetterSpacing = 'tracking-normal',
  desktopLetterSpacing = 'tracking-normal',
  className,
}: AdaptiveTypographyProps) {
  const { isMobile, isTablet, isDesktop } = useAdaptiveUI();
  
  // Determine current properties based on screen size
  const currentFontSize = isMobile ? mobileFontSize : isTablet ? tabletFontSize : desktopFontSize;
  const currentLineHeight = isMobile ? mobileLineHeight : isTablet ? tabletLineHeight : desktopLineHeight;
  const currentFontWeight = isMobile ? mobileFontWeight : isTablet ? tabletFontWeight : desktopFontWeight;
  const currentTextAlign = isMobile ? mobileTextAlign : isTablet ? tabletTextAlign : desktopTextAlign;
  const currentTextColor = isMobile && mobileTextColor ? mobileTextColor : isTablet && tabletTextColor ? tabletTextColor : desktopTextColor;
  const currentLetterSpacing = isMobile ? mobileLetterSpacing : isTablet ? tabletLetterSpacing : desktopLetterSpacing;
  
  // Generate classes based on current properties
  const textClasses = cn(
    currentFontSize,
    currentLineHeight,
    currentFontWeight,
    currentLetterSpacing,
    {
      'text-left': currentTextAlign === 'left',
      'text-center': currentTextAlign === 'center',
      'text-right': currentTextAlign === 'right',
      'text-justify': currentTextAlign === 'justify',
    },
    currentTextColor,
    'transition-all duration-300',
    className
  );
  
  // Render the appropriate element based on the 'as' prop
  const Component = as;
  
  return (
    <Component className={textClasses}>
      {children}
    </Component>
  );
}

export default AdaptiveTypography;
