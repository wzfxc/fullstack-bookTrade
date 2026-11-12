import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Field cannot be empty').email('Enter a valid email address'),
  password: z.string().trim().min(1, 'Field cannot be empty'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Field cannot be empty')
      .max(100, 'Name must be at most 100 characters'),
    email: z.string().trim().min(1, 'Field cannot be empty').email('Enter a valid email address'),
    password: z
      .string()
      .trim()
      .min(1, 'Field cannot be empty')
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters'),
    confirmPassword: z.string().trim().min(1, 'Field cannot be empty'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Field cannot be empty').email('Enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, 'Field cannot be empty')
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters'),
    confirmPassword: z.string().trim().min(1, 'Field cannot be empty'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
