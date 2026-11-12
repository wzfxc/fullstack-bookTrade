'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useLogin } from '@/hooks/use-auth';
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth-schemas';
import { AuthCard } from './auth-card';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const { mutate: login, isPending } = useLogin();

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to manage your books and request exchanges."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit((values) => login(values))} className="space-y-4" noValidate>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" className="w-full" disabled={isPending} isLoading={isPending} loadingText="Logging in...">
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}

