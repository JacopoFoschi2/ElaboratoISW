import { defineStore } from 'pinia';
import AuthenticationService from '../services/AuthenticationService';

interface User {
  userId: number;
  userUsername: string;
  userEmail: string;
  userRole?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    isLoggedIn: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    setLogin(payload: { token: string; user: User }) {
      this.token = payload.token;
      this.user = payload.user;
      this.isLoggedIn = true;

      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    },

    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    loadFromStorage() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          this.token = token;
          this.user = JSON.parse(user);
          this.isLoggedIn = true;
        } catch {
          this.setLogout();
        }
      }
    },

    setLogout() {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      AuthenticationService.logout();
    }
  }
});
