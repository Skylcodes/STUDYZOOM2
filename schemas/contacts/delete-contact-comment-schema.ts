import { z } from 'zod';

// Schema for deleting comments on study sets (formerly contacts)
export const deleteContactCommentSchema = z.object({
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

export type DeleteContactCommentSchema = z.infer<
  typeof deleteContactCommentSchema
>;

// For backward compatibility during refactoring
export const deleteStudySetCommentSchema = deleteContactCommentSchema;
export type DeleteStudySetCommentSchema = DeleteContactCommentSchema;
