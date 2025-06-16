'use client';

import * as React from 'react';

import { NextButton } from '@/components/onboarding/next-button';
import { cn } from '@/lib/utils';

export type OnboardingThemeStepProps = React.HTMLAttributes<HTMLDivElement> & {
  canSubmit: boolean;
  loading: boolean;
  isLastStep: boolean;
};

export function OnboardingThemeStep({
  canSubmit,
  loading,
  isLastStep,
  className,
  ...other
}: OnboardingThemeStepProps): React.JSX.Element {
  return (
    <div className={cn('flex w-full flex-col gap-4', className)} {...other}>
      <div className="text-muted-foreground text-center">
        Using dark theme by default
      </div>
      <NextButton
        loading={loading}
        disabled={!canSubmit}
        isLastStep={isLastStep}
      />
    </div>
  );
}
