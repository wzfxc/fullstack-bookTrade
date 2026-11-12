import { create } from 'zustand';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  markInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  markInitialized: () => set({ isInitialized: true }),
}));

