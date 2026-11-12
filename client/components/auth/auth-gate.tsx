'use client';

import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import type { UserRole } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

interface AuthGateProps {
  requiredRole?: UserRole;
  children: ReactNode;
}

export function AuthGate({ requiredRole, children }: AuthGateProps) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <Spinner />;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Access denied"
        description="You do not have permission to view this page."
        action={
          <Link href="/books" className="text-sm font-medium text-indigo-600 hover:underline">
            Back to books
          </Link>
        }
      />
    );
  }

  return children;
}

