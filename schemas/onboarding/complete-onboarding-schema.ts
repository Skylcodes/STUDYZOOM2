import { z } from 'zod';

import { completeStudyGroupOnboardingSchema } from '@/schemas/onboarding/complete-study-group-onboarding-schema';
import { completeUserOnboardingSchema } from '@/schemas/onboarding/complete-user-onboarding-schema';

// Domain-aligned schema for completing onboarding (combines study group and user onboarding)
export const completeOnboardingSchema =
  completeStudyGroupOnboardingSchema.merge(completeUserOnboardingSchema);

export type CompleteOnboardingSchema = z.infer<typeof completeOnboardingSchema>;
