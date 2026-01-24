import { defineStore } from 'pinia';

interface User {
  userId: number;
  userUsername: string;
  userEmail: string;
  userRole?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem("token"),
    user: null as User | null,
    isLoggedIn: false
  }),

  actions: {
    setLogin(user: User) {
      this.user = user;
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(user));
    },

    loadFromStorage() {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");

      if (token) {
        this.token = token;
        this.isLoggedIn = true;
      }

      if (userRaw && userRaw !== "undefined") {
        try {
          this.user = JSON.parse(userRaw);
        } catch (e) {
          console.warn("Invalid user in localStorage, clearing it");
          localStorage.removeItem("user");
          this.user = null;
        }
      }
    }
    ,

    logout() {
      this.user = null;
      this.isLoggedIn = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});