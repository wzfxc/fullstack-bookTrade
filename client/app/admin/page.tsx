import type { Metadata } from 'next';
import { AdminPanel } from '@/components/admin/admin-panel';
import { AuthGate } from '@/components/auth/auth-gate';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'Admin' };

export default function AdminPage() {
  return (
    <>
      <PageHeader title="Admin panel" description="Review users and moderate books." />
      <AuthGate requiredRole="ADMIN">
        <AdminPanel />
      </AuthGate>
    </>
  );
}

