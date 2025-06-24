import { create } from 'zustand';

interface AuthState {
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  login: (user: { id: string; name: string; email: string }, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
})); 