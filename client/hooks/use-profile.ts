import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-keys';
import type { ProfileFormValues } from '@/lib/schemas/profile-schema';
import type { User, UserProfile } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const { data } = await api.get<UserProfile>('/me/profile');
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { data } = await api.patch<User>('/me/profile', {
        name: values.name,
        email: values.email,
        avatarUrl: values.avatarUrl || null,
      });
      return data;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      toast.success('Profile updated');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

