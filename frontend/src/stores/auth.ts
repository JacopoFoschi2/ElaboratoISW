import { defineStore } from 'pinia';

export interface User {
  userId: number;
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
  state: (): AuthState => {
    const rawToken = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');

    const cleanValue = (val: string | null) => {
      if (val === null || val === "undefined" || val === "null") return null;
      return val;
    };

    const token = cleanValue(rawToken);
    const userStr = cleanValue(rawUser);

    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        user = null;
        localStorage.removeItem('user');
      }
    }

    console.log("Token clean loaded:", token);
    console.log("User clean loaded:", user);

    return {
      token: token,
      user: user,
      isLoggedIn: !!token,
    };
  },
  actions: {
    setLogin(payload: any) {
      // Ora accettiamo il login se riceviamo l'utente, 
      // anche se il token arrivasse nullo dal frontend
      this.user = payload.user;
      this.isLoggedIn = true;

      // Salviamo l'utente nel localStorage per il refresh
      if (payload.user) {
        localStorage.setItem('user', JSON.stringify(payload.user));
      }

      // Il token lo salviamo solo se il server lo invia esplicitamente
      if (payload.token) {
        this.token = payload.token;
        localStorage.setItem('token', payload.token);
      }
    },
    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setLogout() {
      console.log('Logging out user');
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});