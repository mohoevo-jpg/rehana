import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('../components/layout/AppSidebar.vue'), // Using Sidebar as layout wrapper
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
      },
      {
        path: 'cashier',
        name: 'Cashier',
        component: () => import('../views/Cashier.vue'),
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/Products.vue'),
      },
      {
        path: 'sales',
        name: 'Sales',
        component: () => import('../views/Sales.vue'),
      },
      {
        path: 'stock',
        name: 'Stock',
        component: () => import('../views/Stock.vue'),
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/Chat.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('../views/Reports.vue'),
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/Users.vue'),
      },
      {
        path: 'branches',
        name: 'Branches',
        component: () => import('../views/Branches.vue'),
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('../views/Customers.vue'),
      },
      {
        path: 'complaints',
        name: 'Complaints',
        component: () => import('../views/Complaints.vue'),
      },
      {
        path: 'online-orders',
        name: 'OnlineOrders',
        component: () => import('../views/OnlineOrders.vue'),
      },
      {
        path: 'activity-logs',
        name: 'ActivityLogs',
        component: () => import('../views/ActivityLogs.vue'),
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.guest && isAuthenticated) {
    next('/');
  } else if (!to.meta.guest && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
