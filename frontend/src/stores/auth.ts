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
    categories: [] as { categoryId: number; categoryName: string }[],
    categoriesLoaded: false,
  }),

  getters: {
    userAvatar: (state) => state.avatarUrl || '/pfpICON.svg',
  },

  actions: {
    async loadUser() {
      try {
        const res = await fetch('/api/user', {
          credentials: 'include',
        });

        if (!res.ok) {
          this.logout();
          return;
        }

        const data = await res.json();
        const user = Array.isArray(data) ? data[0] : data;

        if (!user) {
          this.logout();
          return;
        }

        this.user = user;
        this.isLoggedIn = true;
        this.setAvatarFromUser();
      } catch {
        this.logout();
      }
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

      const bytes = new Uint8Array(bin);

      let mime = 'image/jpeg';

      if (bytes[0] === 0x89 && bytes[1] === 0x50) mime = 'image/png';
      else if (bytes[0] === 0x52 && bytes[1] === 0x49) mime = 'image/webp';
      else if (bytes[0] === 0xff && bytes[1] === 0xd8) mime = 'image/jpeg';

      const blob = new Blob([bytes], { type: mime });
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

    async fetchCategories(force = false) {
      if (this.categoriesLoaded && !force) return;

      try {
        const res = await fetch('/api/categories');

        if (!res.ok) throw new Error('Failed to fetch categories');

        this.categories = await res.json();
        this.categoriesLoaded = true;
      } catch (err) {
        console.error('Error fetching categories', err);
        this.categories = [];
      }
    },
  },

});
