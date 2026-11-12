import type { Metadata } from 'next';
import { AuthGate } from '@/components/auth/auth-gate';
import { ProfileView } from '@/components/profile/profile-view';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'Profile' };

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="My profile"
        description="Manage your account details, view your stats, and check incoming exchange requests."
      />
      <AuthGate>
        <ProfileView />
      </AuthGate>
    </>
  );
}

