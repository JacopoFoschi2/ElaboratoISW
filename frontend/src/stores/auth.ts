import { defineStore } from 'pinia';
import AuthenticationService from '../services/AuthenticationService';

interface User {
  userId: number;
  userUsername: string;
  userEmail: string;
  userIconBin?: any;
  userRole?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    isLoggedIn: false
  }),
  actions: {
  setLogin(payload: any) {
    localStorage.clear();
    
    this.token = payload.token;
    this.user = payload.user;
    this.isLoggedIn = true;
    if (payload.token) localStorage.setItem('token', payload.token);
    if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
    AuthenticationService.login({ email: payload.user.userEmail, password: '' });
  },
  setUser(userData: User) {
    this.user = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  },
  setLogout() {
    this.token = null;
    this.user = null;
    this.isLoggedIn = false;
    localStorage.clear();
    sessionStorage.clear();
    AuthenticationService.logout();
  }
}
});