'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useResetPassword } from '@/hooks/use-auth';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/lib/schemas/auth-schemas';
import { AuthCard } from './auth-card';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const { mutate: resetPassword, isPending } = useResetPassword();

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        description="This password reset link is missing a valid token."
        footer={
          <Link href="/forgot-password" className="font-medium text-indigo-600 hover:underline">
            Request a new reset link
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          Please request a new password reset email and open the link directly from your inbox.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter a new password for your account."
      footer={
        <>
          Back to{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit((values) =>
          resetPassword({ token, newPassword: values.newPassword }),
        )}
        className="space-y-4"
        noValidate
      >
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <TextField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          isLoading={isPending}
          loadingText="Resetting password..."
        >
          Reset password
        </Button>
      </form>
    </AuthCard>
  );
}

