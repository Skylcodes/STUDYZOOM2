import { z } from 'zod';

// Schema for adding study set page visits (formerly contact page visits)
export const addContactPageVisitSchema = z.object({
  contactId: z
    .string({
      required_error: 'Study set id is required.',
      invalid_type_error: 'Study set id must be a string.'
    })
    .trim()
    .uuid('Study set id is invalid.')
    .min(1, 'Study set id is required.')
    .max(36, 'Maximum 36 characters allowed.')
});

export type AddContactPageVisitSchema = z.infer<
  typeof addContactPageVisitSchema
>;

// For backward compatibility during refactoring
export const addStudySetPageVisitSchema = addContactPageVisitSchema;
export type AddStudySetPageVisitSchema = AddContactPageVisitSchema;
