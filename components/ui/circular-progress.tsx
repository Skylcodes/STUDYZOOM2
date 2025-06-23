import * as React from 'react';

import { cn } from '@/lib/utils';

export interface CircularProgressProps extends React.SVGAttributes<SVGSVGElement> {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  labelClassName?: string;
  labelFormatter?: (value: number) => string;
  gradient?: boolean;
}

export function CircularProgress({
  percentage,
  size = 100,
  strokeWidth = 8,
  showLabel = true,
  labelClassName,
  labelFormatter,
  gradient = false,
  className,
  ...props
}: CircularProgressProps): React.JSX.Element {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const formatLabel = React.useCallback(
    (value: number) => {
      if (labelFormatter) {
        return labelFormatter(value);
      }
      return `${value}%`;
    },
    [labelFormatter]
  );

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('transform -rotate-90', className)}
        {...props}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted/30"
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className={cn(
            gradient
              ? 'stroke-gradient-primary'
              : 'stroke-primary'
          )}
        />
        
        {gradient && (
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        )}
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-lg font-semibold', labelClassName)}>
            {formatLabel(percentage)}
          </span>
        </div>
      )}
    </div>
  );
}
