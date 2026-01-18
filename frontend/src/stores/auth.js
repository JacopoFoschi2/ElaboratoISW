import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null, 
        isLoggedIn: !!localStorage.getItem('token') 
    }),

    actions: {
        setLogin(response) {
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
        }
    }
});