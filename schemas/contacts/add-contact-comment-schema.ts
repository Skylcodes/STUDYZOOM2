import { z } from 'zod';

// Schema for adding comments to study sets (formerly contacts)
export const addContactCommentSchema = z.object({
  // Using contactId for backward compatibility (will be studySetId in future)
  contactId: z
    .string({
      required_error: 'Study set id is required.',
      invalid_type_error: 'Study set id must be a string.'
    })
    .trim()
    .uuid('Study set id is invalid.')
    .min(1, 'Study set id is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  text: z
    .string({
      required_error: 'Text is required.',
      invalid_type_error: 'Text must be a string.'
    })
    .trim()
    .min(1, 'Text is required.')
    .max(2000, 'Maximum 2000 characters allowed.')
});

export type AddContactCommentSchema = z.infer<typeof addContactCommentSchema>;

// For backward compatibility during refactoring
export const addStudySetCommentSchema = addContactCommentSchema;
export type AddStudySetCommentSchema = AddContactCommentSchema;
