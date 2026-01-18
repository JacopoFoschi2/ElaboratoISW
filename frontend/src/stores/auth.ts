import { defineStore } from 'pinia';

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  iconBin?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
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

      if (response.token) {
        localStorage.setItem('token', response.token);
      }
    },

    setLogout() {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
    },
  },
});