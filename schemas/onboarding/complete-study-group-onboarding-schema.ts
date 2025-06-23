import { z } from 'zod';

export const completeStudyGroupOnboardingSchema = z.object({
  name: z
    .string({
      required_error: 'Study group name is required.',
      invalid_type_error: 'Study group name must be a string.'
    })
    .trim()
    .min(1, 'Study group name is required.')
    .max(64, 'Maximum 64 characters allowed.'),
  website: z
    .string({
      invalid_type_error: 'Website must be a string.'
    })
    .trim()
    .max(128, 'Maximum 128 characters allowed.')
    .optional()
    .or(z.literal(''))
});

// For backward compatibility with organization naming
export const completeOrganizationOnboardingSchema = completeStudyGroupOnboardingSchema;

export type CompleteStudyGroupOnboardingSchema = z.infer<
  typeof completeStudyGroupOnboardingSchema
>;

// For backward compatibility with organization naming
export type CompleteOrganizationOnboardingSchema = CompleteStudyGroupOnboardingSchema;
