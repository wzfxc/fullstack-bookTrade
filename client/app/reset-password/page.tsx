import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = { title: 'Reset password' };

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Spinner label="Loading" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

