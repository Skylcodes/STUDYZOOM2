import { z } from 'zod';

export const removeFavoriteSchema = z.object({
  id: z
    .string({
      required_error: 'ID is required.',
      invalid_type_error: 'ID must be a string.'
    })
    .trim()
    .uuid('ID is invalid.')
    .min(1, 'ID is required.')
    .max(36, 'Maximum 36 characters allowed.')
});

export type RemoveFavoriteSchema = z.infer<typeof removeFavoriteSchema>;
