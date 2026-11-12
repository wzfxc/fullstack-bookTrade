import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Field cannot be empty')
    .max(100, 'Name must be at most 100 characters'),
  email: z.string().trim().min(1, 'Field cannot be empty').email('Enter a valid email address'),
  avatarUrl: z.union([
    z.literal(''),
    z.string().trim().min(1, 'Field cannot be empty').url('Enter a valid URL'),
  ]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

