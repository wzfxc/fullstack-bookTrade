'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useRegister } from '@/hooks/use-auth';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas/auth-schemas';
import { AuthCard } from './auth-card';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const { mutate: registerUser, isPending } = useRegister();

  return (
    <AuthCard
      title="Create your account"
      description="Join the community and start exchanging books."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit((values) => registerUser(values))} className="space-y-4" noValidate>
        <TextField label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <TextField
          label="Confirm password"
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
          loadingText="Creating account..."
        >
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}

