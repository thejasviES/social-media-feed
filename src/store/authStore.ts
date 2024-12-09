import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user: User | null) => set({ user }),
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setIsLoading: (value: boolean) => set({ isLoading: value }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));