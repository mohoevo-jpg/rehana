<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md flex flex-col z-10">
      <div class="p-4 border-b flex items-center justify-center py-8">
        <!-- <h1 class="text-2xl font-bold text-primary-600">ريحانة</h1> -->
        <img src="/logo.png" alt="Rehana" class="w-48 h-auto object-contain transition-all duration-300 hover:scale-105" />
      </div>
      
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-2">
          <li v-for="item in filteredMenuItems" :key="item.route">
            <router-link 
              :to="{ name: item.route }"
              class="flex items-center justify-between px-4 py-3 text-gray-600 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
              active-class="bg-primary-50 text-primary-600 font-medium"
            >
              <div class="flex items-center">
                <component :is="item.icon" class="w-5 h-5 ml-3" />
                <span>{{ $t(`menu.${item.key}`) }}</span>
              </div>
              <span 
                v-if="item.key === 'online_orders' && onlineOrdersStore.newOrdersCount > 0" 
                class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
              >
                {{ onlineOrdersStore.newOrdersCount }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t">
        <button 
          @click="logout"
          class="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut class="w-5 h-5 ml-3" />
          <span>{{ $t('menu.logout') }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden flex flex-col relative">
      <header class="bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <h2 class="text-xl font-semibold text-gray-800">{{ $t(`menu.${currentRouteName}`) }}</h2>
        <div class="flex items-center space-x-4 space-x-reverse">
          <NotificationsDropdown />
          <div class="flex items-center">
            <div class="flex flex-col items-end ml-3">
              <span class="text-sm font-medium text-gray-800">{{ user?.name }}</span>
              <span class="text-xs text-gray-500">{{ userBranch?.name || 'الفرع الرئيسي' }}</span>
            </div>
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <User class="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>
      
      <div class="flex-1 overflow-auto p-6">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useUsersStore } from '../../store/users';
import { useBranchesStore } from '../../store/branches';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings, 
  MessageCircle, 
  LogOut,
  User,
  FileText,
  Users,
  Building,
  Globe,
  Activity,
  AlertTriangle
} from 'lucide-vue-next';
import { useOnlineOrdersStore } from '../../store/onlineOrders';
import NotificationsDropdown from './NotificationsDropdown.vue';

const authStore = useAuthStore();
const usersStore = useUsersStore();
const branchesStore = useBranchesStore();
const onlineOrdersStore = useOnlineOrdersStore();
const router = useRouter();
const route = useRoute();

const user = computed(() => {
  // Prefer fetching fresh user data from usersStore to get latest permissions
  if (authStore.currentUser?.id) {
    const freshUser = usersStore.getUserById(authStore.currentUser.id);
    if (freshUser) return freshUser;
  }
  return authStore.currentUser;
});
const userBranch = computed(() => {
  if (!user.value || !user.value.branchId) return null;
  return branchesStore.branches.find(b => b.id === user.value.branchId);
});
const currentRouteName = computed(() => route.name ? route.name.toLowerCase() : 'dashboard');

const menuItems = [
  { key: 'dashboard', route: 'Dashboard', icon: LayoutDashboard },
  { key: 'cashier', route: 'Cashier', icon: ShoppingCart },
  { key: 'online_orders', route: 'OnlineOrders', icon: Globe },
  { key: 'products', route: 'Products', icon: Package },
  { key: 'sales', route: 'Sales', icon: BarChart3 },
  { key: 'stock', route: 'Stock', icon: Package },
  { key: 'reports', route: 'Reports', icon: FileText },
  { key: 'activity_logs', route: 'ActivityLogs', icon: Activity },
  { key: 'chat', route: 'Chat', icon: MessageCircle },
  { key: 'users', route: 'Users', icon: Users },
  { key: 'customers', route: 'Customers', icon: Users },
  { key: 'complaints', route: 'Complaints', icon: MessageCircle },
  { key: 'branches', route: 'Branches', icon: Building },
  { key: 'settings', route: 'Settings', icon: Settings },
];

const filteredMenuItems = computed(() => {
  const permissions = user.value?.permissions || [];
  const role = user.value?.role;
  
  // Admin always has access, or if 'all' permission is present
  if (role === 'admin' || permissions.includes('all')) {
    return menuItems;
  }
  
  return menuItems.filter(item => {
    // Hardcode: Allow 'complaints' for cashier role explicitly to ensure it shows
    if (role === 'cashier' && item.key === 'complaints') return true;
    
    return permissions.includes(item.key);
  });
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>