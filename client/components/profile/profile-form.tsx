'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useUpdateProfile } from '@/hooks/use-profile';
import { profileSchema, type ProfileFormValues } from '@/lib/schemas/profile-schema';
import type { UserProfile } from '@/lib/types';

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [hasAvatarLoadFailed, setHasAvatarLoadFailed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.avatarUrl ?? '',
    },
  });

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const watchedAvatarUrl = watch('avatarUrl');

  useEffect(() => {
    reset({
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.avatarUrl ?? '',
    });
  }, [profile.name, profile.email, profile.avatarUrl, reset]);

  useEffect(() => {
    setHasAvatarLoadFailed(false);
  }, [watchedAvatarUrl]);

  const previewAvatarUrl = watchedAvatarUrl?.trim() || profile.avatarUrl;

  return (
    <form
      onSubmit={handleSubmit((values) => updateProfile(values))}
      noValidate
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-gray-500">
          {previewAvatarUrl && !hasAvatarLoadFailed ? (
            <img
              src={previewAvatarUrl}
              alt={profile.name}
              onError={() => setHasAvatarLoadFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserIcon className="h-7 w-7" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-gray-900">Edit profile</h2>
          <p className="truncate text-sm text-gray-500">Update your personal details and avatar.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <TextField
        label="Avatar URL (optional)"
        type="url"
        placeholder="https://example.com/avatar.jpg"
        error={errors.avatarUrl?.message}
        {...register('avatarUrl')}
      />

      <Button
        type="submit"
        disabled={isPending}
        isLoading={isPending}
        loadingText="Saving..."
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        Save changes
      </Button>
    </form>
  );
}

