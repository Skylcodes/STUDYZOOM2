import { z } from 'zod';

// Schema for deleting study sets (formerly contacts)
export const deleteContactSchema = z.object({
  id: z
    .string({
      required_error: 'Id is required.',
      invalid_type_error: 'Id must be a string.'
    })
    .trim()
    .uuid('Id is invalid.')
    .min(1, 'Id is required.')
    .max(36, 'Maximum 36 characters allowed.')
});

export type DeleteContactSchema = z.infer<typeof deleteContactSchema>;

// For backward compatibility during refactoring
export const deleteStudySetSchema = deleteContactSchema;
export type DeleteStudySetSchema = DeleteContactSchema;
