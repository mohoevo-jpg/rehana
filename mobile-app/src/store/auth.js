import { defineStore } from 'pinia'
import { SERVER_URL } from '../config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    isLoading: false,
    error: null
  }),
  
  getters: {
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login({ identifier, password }) {
      this.isLoading = true
      this.error = null
      try {
        const res = await fetch(`${SERVER_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        })
        
        const data = await res.json()
        
        if (res.ok) {
          this.user = data.user
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(data.user))
          return { success: true, message: data.message }
        } else {
          this.error = data.error
          return { success: false, error: data.error }
        }
      } catch (e) {
        this.error = 'حدث خطأ في الاتصال'
        return { success: false, error: 'حدث خطأ في الاتصال' }
      } finally {
        this.isLoading = false
      }
    },

    async registerInit(userData) {
      this.isLoading = true
      this.error = null
      try {
        const res = await fetch(`${SERVER_URL}/api/auth/register-init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })
        
        const data = await res.json()
        
        if (res.ok) {
          return { success: true, message: data.message }
        } else {
          this.error = data.error
          return { success: false, error: data.error }
        }
      } catch (e) {
        this.error = 'حدث خطأ في الاتصال'
        return { success: false, error: 'حدث خطأ في الاتصال' }
      } finally {
        this.isLoading = false
      }
    },

    async registerVerify(phone, code) {
      this.isLoading = true
      this.error = null
      try {
        const res = await fetch(`${SERVER_URL}/api/auth/register-verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, code })
        })
        
        const data = await res.json()
        
        if (res.ok) {
          this.user = data.user
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(data.user))
          return { success: true, message: data.message }
        } else {
          this.error = data.error
          return { success: false, error: data.error }
        }
      } catch (e) {
        this.error = 'حدث خطأ في الاتصال'
        return { success: false, error: 'حدث خطأ في الاتصال' }
      } finally {
        this.isLoading = false
      }
    },

    async registerResend(phone, method) {
      // Don't set global loading here to avoid blocking UI excessively, or handle in component
      try {
        const res = await fetch(`${SERVER_URL}/api/auth/register-resend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, method })
        })
        
        const data = await res.json()
        return { success: res.ok, message: data.message, error: data.error }
      } catch (e) {
        return { success: false, error: 'حدث خطأ في الاتصال' }
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null
      try {
        const res = await fetch(`${SERVER_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })
        
        const data = await res.json()
        
        if (res.ok) {
          this.user = data.user
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(data.user))
          return true
        } else {
          this.error = data.error
          return false
        }
      } catch (e) {
        this.error = 'حدث خطأ في الاتصال'
        return false
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    },

    updateUser(updatedUser) {
      this.user = { ...this.user, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async toggleFavorite(productId) {
      if (!this.user) return false

      // Optimistic update
      const favorites = this.user.favorites || []
      const index = favorites.indexOf(productId)
      let newFavorites
      
      if (index === -1) {
        newFavorites = [...favorites, productId]
      } else {
        newFavorites = favorites.filter(id => id !== productId)
      }
      
      const originalUser = { ...this.user }
      this.updateUser({ favorites: newFavorites })

      try {
        const res = await fetch(`${SERVER_URL}/api/users/${this.user.id}/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })

        if (res.ok) {
          const data = await res.json()
          this.updateUser(data.user)
          return true
        } else {
          // Revert on error
          this.updateUser(originalUser)
          return false
        }
      } catch (e) {
        console.error(e)
        this.updateUser(originalUser)
        return false
      }
    },

    async addAddress(addressData) {
      if (!this.user) return false
      try {
        const res = await fetch(`${SERVER_URL}/api/users/${this.user.id}/addresses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addressData)
        })
        if (res.ok) {
          const data = await res.json()
          this.updateUser(data.user)
          return true
        }
        return false
      } catch (e) {
        console.error(e)
        return false
      }
    },

    async deleteAddress(addressId) {
      if (!this.user) return false
      try {
        const res = await fetch(`${SERVER_URL}/api/users/${this.user.id}/addresses/${addressId}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          const data = await res.json()
          this.updateUser(data.user)
          return true
        }
        return false
      } catch (e) {
        console.error(e)
        return false
      }
    },

    async updateProfile(profileData) {
      if (!this.user) return false
      this.isLoading = true
      try {
        const res = await fetch(`${SERVER_URL}/api/users/${this.user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData)
        })
        
        if (res.ok) {
          const data = await res.json()
          this.updateUser(data.user)
          return true
        }
        return false
      } catch (e) {
        console.error(e)
        return false
      } finally {
        this.isLoading = false
      }
    },

    async deleteAccount() {
      if (!this.user) return false
      this.isLoading = true
      try {
        const res = await fetch(`${SERVER_URL}/api/users/${this.user.id}`, {
          method: 'DELETE'
        })
        
        if (res.ok) {
          this.logout()
          return true
        }
        return false
      } catch (e) {
        console.error(e)
        return false
      } finally {
        this.isLoading = false
      }
    }
  }
})
