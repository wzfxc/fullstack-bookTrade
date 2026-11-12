'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useForgotPassword } from '@/hooks/use-auth';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/lib/schemas/auth-schemas';
import { AuthCard } from './auth-card';

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { mutate: requestReset, isPending } = useForgotPassword();

  const onSubmit = (values: ForgotPasswordFormValues) => {
    requestReset(values, { onSuccess: () => reset() });
  };

  return (
    <AuthCard
      title="Forgot password"
      description="Enter your email address and we will send you a link to reset your password."
      footer={
        <>
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          isLoading={isPending}
          loadingText="Sending reset link..."
        >
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}

