import { defineStore } from 'pinia';

export interface User {
  userId: number; // Use userId consistently
  userUsername: string;
  userEmail: string;
  userIconBin?: { data: number[] };
}

export interface LoginResponse {
  token: string;
  user: User;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    user: null,
    isLoggedIn: !!localStorage.getItem('token'),
  }),
  actions: {
    setLogin(response: LoginResponse) {
      this.token = response.token;
      this.user = response.user;
      this.isLoggedIn = true;
      if (response.token) localStorage.setItem('token', response.token);
    },
    setUser(user: User) {
      this.user = user;
    },
    setLogout() {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
    },
  },
});