import { z } from 'zod';

// Schema for deleting action items (formerly contact tasks) from study sets
export const deleteActionItemSchema = z.object({
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

export type DeleteActionItemSchema = z.infer<typeof deleteActionItemSchema>;

// For backward compatibility during refactoring
export const deleteContactTaskSchema = deleteActionItemSchema;
export type DeleteContactTaskSchema = DeleteActionItemSchema;
