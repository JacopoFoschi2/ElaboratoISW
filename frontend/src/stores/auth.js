import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth',{
    state: () => ({
        isLoggedIn: ref(true),
        user: ref(null),
    }),
    actions: {
        setLogin(userData){
            this.isLoggedIn = true;
            this.user = userData;
        },
        setLogout(){
            this.isLoggedIn = false;
            this.user = null;
        }
    }
});