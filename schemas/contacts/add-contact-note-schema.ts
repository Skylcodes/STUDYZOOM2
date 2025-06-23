import { z } from 'zod';

// Schema for adding notes to study sets (formerly contacts)
export const addContactNoteSchema = z.object({
  // Using contactId for backward compatibility, but this refers to studySetId in the domain model
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
    .max(8000, 'Maximum 8000 characters allowed.')
    .optional()
    .or(z.literal(''))
});

export type AddContactNoteSchema = z.infer<typeof addContactNoteSchema>;

// For backward compatibility during refactoring
export const addStudySetNoteSchema = addContactNoteSchema;
export type AddStudySetNoteSchema = AddContactNoteSchema;
