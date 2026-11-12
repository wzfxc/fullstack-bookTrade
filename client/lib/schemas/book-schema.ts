import { z } from 'zod';

export const bookSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Field cannot be empty')
    .max(200, 'Title must be at most 200 characters'),
  author: z
    .string()
    .trim()
    .min(1, 'Field cannot be empty')
    .max(200, 'Author must be at most 200 characters'),
  photoUrl: z.union([
    z.literal(''),
    z.string().trim().min(1, 'Field cannot be empty').url('Enter a valid URL'),
  ]),
});

export type BookFormValues = z.infer<typeof bookSchema>;
