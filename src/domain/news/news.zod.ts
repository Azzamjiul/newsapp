import { z } from 'zod';

export const createNewsSchema = z.object({
  imageUrl: z.string().url(),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  publisherId: z.number().int(),
  publisherUrl: z.string().url(),
  importedAt: z.coerce.date(),
  author: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  source: z.string().optional(),
});

export const updateNewsSchema = createNewsSchema.partial();
