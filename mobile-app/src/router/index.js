import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { Capacitor } from '@capacitor/core'
import { useAuthStore } from '../store/auth'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue'
import Orders from '../views/Orders.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import Wallet from '../views/Wallet.vue'
import Favorites from '../views/Favorites.vue'
import Addresses from '../views/Addresses.vue'
import AddAddress from '../views/AddAddress.vue'
import Settings from '../views/Settings.vue'
import Complaints from '../views/Complaints.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import Notifications from '../views/Notifications.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/complaints',
    name: 'Complaints',
    component: Complaints,
    meta: { requiresAuth: false }
  },
  {
    path: '/addresses',
    name: 'Addresses',
    component: Addresses,
    meta: { requiresAuth: true }
  },
  {
    path: '/addresses/add',
    name: 'AddAddress',
    component: AddAddress,
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: false }
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: Wallet,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: false }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: Capacitor.isNativePlatform() 
    ? createWebHashHistory() 
    : createWebHistory('/shop/'),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('Router navigation:', from.path, '->', to.path)
  const authStore = useAuthStore()
  const isNative = Capacitor.isNativePlatform()

  // 1. Force Login for Native App (APK/iOS) if not authenticated
  // Allow 'Login' page obviously, and public pages (requiresAuth: false)
  if (isNative && !authStore.isAuthenticated && to.name !== 'Login' && to.meta.requiresAuth) {
    console.log('Native App: Force Login for protected route')
    return next({ name: 'Login' })
  }
  
  // 2. Standard Guard for protected routes (Web & Native)
  // For Web: Home/Cart are public (requiresAuth: false), others are private.
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Navigation blocked: authentication required')
    return next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  }

  // 3. Admin Guard
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.log('Navigation blocked: admin required')
    return next({ name: 'Home' })
  }

  next()
})

export default router
