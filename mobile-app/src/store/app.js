import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { useAuthStore } from './auth'
import { SERVER_URL } from '../config'

export const useAppStore = defineStore('app', {
  state: () => ({
    products: [],
    categories: [],
    banners: [],
    wishlist: [],
    cart: [],
    orders: [],
    socket: null,
    isConnected: false,
    customerName: '',
    customerPhone: '',
    settings: {
      deliveryFee: 5000,
      minOrderAmount: 0,
      isStoreOpen: true,
      allowOrders: true,
      currencySymbol: 'د.ع',
      minAppVersion: '1.0.0',
      latestAppVersion: '1.0.0',
      updateUrl: '',
      updateMessage: 'تحديث جديد متوفر',
      aboutUsText: 'نحن متجر ريحانة للورود الطبيعية والصناعية، نسعى لتقديم أجمل الباقات والهدايا لمناسباتكم السعيدة. خبرة سنوات في تنسيق الزهور وتجهيز المناسبات.',
      facebookUrl: '',
      instagramUrl: '',
      tiktokUrl: '',
      email: '',
      announcement: {
        active: false,
        title: '',
        message: ''
      }
    },
    rewardNotification: null,
    statusNotification: null
  }),
  getters: {
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    cartCount: (state) => {
      return state.cart.reduce((count, item) => count + item.quantity, 0)
    },
    getProductOrderCount: (state) => (productId) => {
      const authStore = useAuthStore()
      if (!authStore.user) return 0
      
      const userOrders = state.orders.filter(o => o.customerId === authStore.user.id)
      return userOrders.reduce((count, order) => {
        const item = order.items.find(i => i.id === productId)
        return count + (item ? 1 : 0) // Counts number of orders containing the item, or should it be quantity? "كم مرة طلب منها" usually means number of orders.
        // If user wants total quantity bought: return count + (item ? item.quantity : 0)
        // "كم مرة طلب منها" -> How many times he ordered from it. Usually means Order Count.
      }, 0)
    }
  },
  actions: {
    initSocket() {
      if (this.socket) return

      this.socket = io(SERVER_URL, {
        transports: ['websocket', 'polling']
      })
      
      this.socket.on('connect', () => {
        this.isConnected = true
        this.socket.emit('register-customer')
        this.fetchProducts()
        this.fetchSettings()
      })

      this.socket.on('disconnect', () => {
        this.isConnected = false
      })

      this.socket.on('order-status-updated', ({ id, status }) => {
        const order = this.orders.find(o => o.id === id)
        if (order) {
          order.status = status
        }
      })

      this.socket.on('settings-updated', (newSettings) => {
        this.settings = newSettings
      })

      this.socket.on('products-updated', (products) => {
        this.products = products
      })
    },

    async fetchProducts() {
      try {
        const res = await fetch(`${SERVER_URL}/api/products`)
        if (res.ok) {
          const products = await res.json()
          this.products = products
          // Cache products for offline use
          localStorage.setItem('cached_products', JSON.stringify(products))
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        // Fallback to cached products if available
        const cached = localStorage.getItem('cached_products')
        if (cached) {
          this.products = JSON.parse(cached)
        }
      }
    },

    async fetchSettings() {
      try {
        const res = await fetch(`${SERVER_URL}/api/settings`)
        if (res.ok) {
          this.settings = await res.json()
          // Cache settings for offline use
          localStorage.setItem('cached_settings', JSON.stringify(this.settings))
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        // Fallback to cached settings if available
        const cached = localStorage.getItem('cached_settings')
        if (cached) {
          this.settings = JSON.parse(cached)
        }
      }
    },

    async updateSettings(newSettings) {
      try {
        const res = await fetch(`${SERVER_URL}/api/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        })
        if (res.ok) {
          this.settings = (await res.json()).settings
          return true
        }
      } catch (error) {
        console.error('Failed to update settings:', error)
        return false
      }
    },

    async fetchCategories() {
      try {
        const res = await fetch(`${SERVER_URL}/api/categories`)
        if (res.ok) {
          this.categories = await res.json()
          localStorage.setItem('cached_categories', JSON.stringify(this.categories))
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        const cached = localStorage.getItem('cached_categories')
        if (cached) {
          this.categories = JSON.parse(cached)
        }
      }
    },

    async fetchBanners() {
      try {
        const res = await fetch(`${SERVER_URL}/api/banners`)
        if (res.ok) {
          this.banners = await res.json()
          localStorage.setItem('cached_banners', JSON.stringify(this.banners))
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error)
        const cached = localStorage.getItem('cached_banners')
        if (cached) {
          this.banners = JSON.parse(cached)
        }
      }
    },

    async fetchOrders() {
      try {
        const res = await fetch(`${SERVER_URL}/api/orders`)
        if (res.ok) {
          this.orders = await res.json()
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
    },

    addToCart(product, quantity = 1) {
      const existingItem = this.cart.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        const effectivePrice = product.discountPrice || product.price
        this.cart.push({ ...product, price: effectivePrice, originalPrice: product.price, quantity })
      }
    },

    removeFromCart(productId) {
      const index = this.cart.findIndex(item => item.id === productId)
      if (index !== -1) {
        this.cart.splice(index, 1)
      }
    },

    updateQuantity(productId, quantity) {
      const item = this.cart.find(item => item.id === productId)
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity
        } else {
          this.removeFromCart(productId)
        }
      }
    },

    async submitOrder(paymentDetails = {}) {
      if (this.cart.length === 0) return false

      const orderData = {
        customerName: this.customerName || 'عميل تطبيق',
        customerPhone: this.customerPhone,
        customerId: paymentDetails.customerId,
        items: this.cart,
        total: this.cartTotal,
        paymentMethod: paymentDetails.paymentMethod || 'cash',
        useWallet: paymentDetails.useWallet || false
      }

      try {
        const res = await fetch(`${SERVER_URL}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        })
        
        if (res.ok) {
           const data = await res.json()
           this.cart = []
           this.orders.unshift(data.order)
           return data
        }
        return false
      } catch (error) {
        console.error('Order failed:', error)
        return false
      }
    },

    async addProduct(product) {
      try {
        // If it's a new product, default isAvailable to true
        const isNew = !product.id
        const payload = { ...product }
        if (isNew) {
           payload.isAvailable = true
           // Default quantity if not provided
           if (payload.quantity === undefined) payload.quantity = 0
        }

        const res = await fetch(`${SERVER_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          const { product: newProduct } = await res.json()
          // No need to manually update state if socket is connected and working, 
          // but for instant feedback we can keep it, or rely on socket 'products-updated'.
          // To be safe and instant:
          const idx = this.products.findIndex(p => p.id === newProduct.id)
          if (idx !== -1) {
            this.products[idx] = newProduct
          } else {
            this.products.push(newProduct)
          }
        }
      } catch (error) {
        console.error('Failed to add product:', error)
      }
    },

    async deleteProduct(id) {
      try {
        const res = await fetch(`${SERVER_URL}/api/products/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          this.products = this.products.filter(p => p.id !== id)
        }
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    },

    async toggleProductAvailability(product) {
      const currentStatus = product.isAvailable !== false
      const updatedProduct = { ...product, isAvailable: !currentStatus }
      try {
        const res = await fetch(`${SERVER_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct)
        })
        if (res.ok) {
          const { product: newProduct } = await res.json()
          const idx = this.products.findIndex(p => p.id === newProduct.id)
          if (idx !== -1) {
            this.products[idx] = newProduct
          }
        }
      } catch (error) {
        console.error('Failed to update product availability:', error)
      }
    },

    async addCategory(category) {
      try {
        const res = await fetch(`${SERVER_URL}/api/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category)
        })
        if (res.ok) {
          const newCategory = await res.json()
          this.categories.push(newCategory)
        }
      } catch (error) {
        console.error('Failed to add category:', error)
      }
    },

    async updateCategory(category) {
      try {
        const res = await fetch(`${SERVER_URL}/api/categories/${category.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category)
        })
        if (res.ok) {
          const updated = await res.json()
          const idx = this.categories.findIndex(c => c.id === updated.id)
          if (idx !== -1) this.categories[idx] = updated
        }
      } catch (error) {
        console.error('Failed to update category:', error)
      }
    },

    async deleteCategory(id) {
      try {
        const res = await fetch(`${SERVER_URL}/api/categories/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          this.categories = this.categories.filter(c => c.id !== id)
        }
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    },

    async addBanner(banner) {
      try {
        const res = await fetch(`${SERVER_URL}/api/banners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(banner)
        })
        if (res.ok) {
          const newBanner = await res.json()
          this.banners.push(newBanner)
        }
      } catch (error) {
        console.error('Failed to add banner:', error)
      }
    },

    async updateBanner(banner) {
      try {
        const res = await fetch(`${SERVER_URL}/api/banners/${banner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(banner)
        })
        if (res.ok) {
          const updated = await res.json()
          const idx = this.banners.findIndex(b => b.id === updated.id)
          if (idx !== -1) this.banners[idx] = updated
        }
      } catch (error) {
        console.error('Failed to update banner:', error)
      }
    },

    async deleteBanner(id) {
      try {
        const res = await fetch(`${SERVER_URL}/api/banners/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          this.banners = this.banners.filter(b => b.id !== id)
        }
      } catch (error) {
        console.error('Failed to delete banner:', error)
      }
    }
  }
})