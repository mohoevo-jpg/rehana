import { defineStore } from 'pinia';
import { useUsersStore } from './users';

export const useAuthStore = defineStore('auth', {
  state: () => {
    try {
      // Check localStorage first (Persistent)
      let user = localStorage.getItem('user');
      let token = localStorage.getItem('token');
      
      // If not found, check sessionStorage (Session only)
      if (!user || !token) {
        user = sessionStorage.getItem('user');
        token = sessionStorage.getItem('token');
      }

      return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
      };
    } catch (e) {
      console.error('Error parsing auth state:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      return {
        user: null,
        token: null,
      };
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },
  actions: {
    async login(username, password, rememberMe = true) {
      const usersStore = useUsersStore();
      const user = usersStore.verifyCredentials(username, password);

      if (user) {
        this.user = user;
        this.token = 'mock-token-' + Date.now();
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(this.user));
          localStorage.setItem('token', this.token);
          // Clear session storage just in case
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
        } else {
          sessionStorage.setItem('user', JSON.stringify(this.user));
          sessionStorage.setItem('token', this.token);
          // Clear local storage just in case
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
        
        return true;
      }

      throw new Error('بيانات الدخول غير صحيحة');
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    },
    refreshUser() {
      if (this.user && this.user.id) {
        const usersStore = useUsersStore();
        const freshUser = usersStore.getUserById(this.user.id);
        if (freshUser) {
          this.user = freshUser;
          // Update wherever it is stored
          if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(this.user));
          } else if (sessionStorage.getItem('user')) {
            sessionStorage.setItem('user', JSON.stringify(this.user));
          }
        }
      }
    }
  }
});
