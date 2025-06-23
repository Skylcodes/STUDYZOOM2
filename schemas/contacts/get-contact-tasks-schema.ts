import { z } from 'zod';

export const getActionItemsSchema = z.object({
  contactId: z
    .string({
      invalid_type_error: 'Contact id must be a string.' // Will be updated to 'Study set id must be a string.'
    })
    .trim()
    .uuid('Contact id is invalid.') // Will be updated to 'Study set id is invalid.'
    .max(36, 'Maximum 36 characters allowed.')
});

export type GetActionItemsSchema = z.infer<typeof getActionItemsSchema>;

// Backward compatibility exports
export const getContactTasksSchema = getActionItemsSchema;
export type GetContactTasksSchema = GetActionItemsSchema;
