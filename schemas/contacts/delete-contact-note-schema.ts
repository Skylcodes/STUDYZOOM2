import { z } from 'zod';

// Schema for deleting notes from study sets (formerly contacts)
export const deleteContactNoteSchema = z.object({
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

export type DeleteContactNoteSchema = z.infer<typeof deleteContactNoteSchema>;

// For backward compatibility during refactoring
export const deleteStudySetNoteSchema = deleteContactNoteSchema;
export type DeleteStudySetNoteSchema = DeleteContactNoteSchema;
