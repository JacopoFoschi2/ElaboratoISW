import { defineStore } from 'pinia';

interface User {
  userId: number;
  userEmail: string;
  userUsername: string;
  userRole: string;
  userIconBin?: { type: 'Buffer'; data: number[] } | number[];
  userIconName?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    avatarUrl: null as string | null,
    isLoggedIn: false,
  }),

  getters: {
    userAvatar(state): string {
      return state.avatarUrl ?? '/pfpICON.svg';
    },
  },

  actions: {
    async loadUser() {
      const res = await fetch('/api/user');
      const user: User = await res.json();

      this.user = user;
      this.isLoggedIn = true;

      this.setAvatarFromUser();
    },

    setAvatarFromUser() {
      if (!this.user?.userIconBin) {
        this.clearAvatar();
        return;
      }

      const bin = Array.isArray(this.user.userIconBin)
        ? this.user.userIconBin
        : this.user.userIconBin.data;

      if (!bin?.length) {
        this.clearAvatar();
        return;
      }

      if (this.avatarUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(this.avatarUrl);
      }

      const uint8 = new Uint8Array(bin);

      const blob = new Blob([uint8], { type: 'image/jpeg' });

      this.avatarUrl = URL.createObjectURL(blob);
    },

    clearAvatar() {
      if (this.avatarUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(this.avatarUrl);
      }
      this.avatarUrl = null;
    },

    logout() {
      this.clearAvatar();
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
    },
  },
});
