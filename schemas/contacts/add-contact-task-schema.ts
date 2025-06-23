import { ActionItemStatus } from '../../types/prisma-mappings';
import { z } from 'zod';

// Schema for adding action items (formerly contact tasks) to study sets
export const addActionItemSchema = z.object({
  contactId: z
    .string({
      invalid_type_error: 'StudySet id must be a string.'
    })
    .trim()
    .uuid('StudySet id is invalid.')
    .max(36, 'Maximum 36 characters allowed.'),
  // TODO: Rename to studySetId in future refactoring
  title: z
    .string({
      required_error: 'Title is required.',
      invalid_type_error: 'Title must be a string.'
    })
    .trim()
    .min(1, 'Title is required.')
    .max(64, `Maximum 64 characters allowed.`),
  description: z
    .string({
      invalid_type_error: 'Description must be a string.'
    })
    .trim()
    .max(4000, `Maximum 4000 characters allowed.`)
    .optional()
    .or(z.literal('')),
  dueDate: z.coerce.date().optional(),
  status: z.nativeEnum(ActionItemStatus, {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be a string'
  })
});

export type AddActionItemSchema = z.infer<typeof addActionItemSchema>;

// For backward compatibility during refactoring
export const addContactTaskSchema = addActionItemSchema;
export type AddContactTaskSchema = AddActionItemSchema;
