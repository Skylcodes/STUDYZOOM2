import { z } from 'zod';

export const addFavoriteSchema = z.object({
  id: z.string().uuid()
});

export type AddFavoriteSchema = z.infer<typeof addFavoriteSchema>;
