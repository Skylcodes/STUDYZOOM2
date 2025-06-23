'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

import { completeUserOnlyOnboarding } from '@/actions/onboarding/complete-user-only-onboarding';
import { OnboardingProfileStep } from '@/components/onboarding/onboarding-profile-step';
import { OnboardingThemeStep } from '@/components/onboarding/onboarding-theme-step';
import { FormProvider } from '@/components/ui/form';
import { Logo } from '@/components/ui/logo';
import type { getOnboardingData } from '@/data/onboarding/get-onboarding-data';
import { useZodForm } from '@/hooks/use-zod-form';
import { cn } from '@/lib/utils';
import {
  completeUserOnboardingSchema,
  type CompleteUserOnboardingSchema
} from '@/schemas/onboarding/complete-user-onboarding-schema';
import { FileUploadAction } from '@/types/file-upload-action';

export enum Step {
  Profile,
  Theme
}

const headers: Record<Step, string> = {
  [Step.Profile]: 'Set up your profile',
  [Step.Theme]: 'Choose your theme'
};

const descriptions: Record<Step, string> = {
  [Step.Profile]:
    "Check if the profile information is correct. You'll be able to change this later in the account settings page.",
  [Step.Theme]:
    'Select your preferred theme for the application.'
};

const components: Record<
  Step,
  typeof OnboardingProfileStep | typeof OnboardingThemeStep
> = {
  [Step.Profile]: OnboardingProfileStep,
  [Step.Theme]: OnboardingThemeStep
};

export type OnboardingWizardProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  user: {
    name: string;
    email?: string;
    image?: string;
    completedOnboarding: boolean;
  };
};

export function OnboardingWizard({
  user,
  className,
  ...other
}: OnboardingWizardProps): React.JSX.Element {
  const [currentStep, setCurrentStep] = React.useState<Step>(Step.Profile);
  const { setTheme } = useTheme();
  
  const methods = useZodForm({
    schema: completeUserOnboardingSchema,
    mode: 'all',
    defaultValues: {
      action: FileUploadAction.None,
      image: user?.image,
      name: user?.name ?? 'Unknown',
      phone: ''
    }
  });
  
  const Component = components[currentStep];
  const isLastStep = currentStep === Step.Theme;
  const canSubmit = !methods.formState.isSubmitting && methods.formState.isValid;

  const handleScrollToTop = (): void => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const onSubmit: SubmitHandler<CompleteUserOnboardingSchema> = async (values) => {
    if (!canSubmit) {
      return;
    }

    if (!isLastStep) {
      handleNext();
      return;
    }

    // Apply theme selection
    if (currentStep === Step.Theme) {
      // Theme selection will be handled by the OnboardingThemeStep component
      // which directly uses the setTheme function
    }

    // Complete user onboarding
    const result = await completeUserOnlyOnboarding({
      action: values.action,
      image: values.image,
      name: values.name,
      phone: values.phone
    });

    if (result?.serverError || result?.validationErrors) {
      toast.error("Couldn't complete onboarding");
      return;
    }

    toast.success('Onboarding completed');
  };
  
  const handleNext = (): void => {
    if (currentStep === Step.Profile) {
      setCurrentStep(Step.Theme);
      handleScrollToTop();
    } else if (isLastStep) {
      methods.handleSubmit(onSubmit)();
    }
  };

  return (
    <div
      className={cn('flex flex-col pb-1.5', className)}
      {...other}
    >
      <div className="mx-auto mt-6">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
      </div>
      <div className="mx-auto w-full max-w-lg p-4 sm:p-8 md:p-12">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex w-48 flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {Object.keys(Step).length / 2}
              </p>
            </div>
            <h1 className="text-3xl font-medium">{headers[currentStep]}</h1>
            <p className="text-base text-muted-foreground">
              {descriptions[currentStep]}
            </p>
            <Component
              canSubmit={canSubmit}
              loading={methods.formState.isSubmitting}
              isLastStep={isLastStep}
              email={user?.email ?? ''}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
