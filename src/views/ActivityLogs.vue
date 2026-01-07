<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">سجل النشاطات</h1>
        <p class="text-gray-500 dark:text-gray-400">سجل كامل لجميع العمليات في النظام</p>
      </div>
      <button @click="fetchLogs" class="btn-secondary">
        <RefreshCw class="w-4 h-4 mr-2" />
        تحديث
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تصفية حسب النوع</label>
          <select v-model="filterType" class="input-field">
            <option value="all">الكل</option>
            <option value="order">الطلبات</option>
            <option value="user">المستخدمين</option>
            <option value="product">المنتجات</option>
            <option value="campaign">الحملات</option>
            <option value="settings">الإعدادات</option>
            <option value="system">النظام</option>
          </select>
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">بحث</label>
          <input v-model="searchQuery" type="text" placeholder="ابحث في السجل..." class="input-field" />
        </div>
      </div>
    </div>

    <!-- Logs List -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th class="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-300">الوقت</th>
              <th class="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-300">النوع</th>
              <th class="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-300">الحدث</th>
              <th class="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-300">التفاصيل</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap" dir="ltr">
                {{ formatDate(log.timestamp) }}
              </td>
              <td class="py-3 px-4">
                <span :class="getTypeClass(log.type)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getTypeLabel(log.type) }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-white font-medium">
                {{ log.message }}
              </td>
              <td class="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                <pre class="whitespace-pre-wrap font-mono text-xs">{{ formatDetails(log.details) }}</pre>
              </td>
            </tr>
            <tr v-if="filteredLogs.length === 0">
              <td colspan="4" class="py-8 text-center text-gray-500 dark:text-gray-400">
                لا توجد سجلات مطابقة
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import api from '../services/api';
import { format } from 'date-fns';
import { io } from 'socket.io-client';

const logs = ref([]);
const filterType = ref('all');
const searchQuery = ref('');
const isElectron = !!(window.process && window.process.versions && window.process.versions.electron);
const socketUrl = isElectron ? 'http://localhost:3001' : '';
const socket = io(socketUrl, { path: '/socket.io' });

const fetchLogs = async () => {
  try {
    const res = await api.get('/logs');
    logs.value = res.data;
  } catch (err) {
    console.error('Failed to fetch logs:', err);
  }
};

onMounted(() => {
  fetchLogs();
  
  socket.on('new-activity', (log) => {
    logs.value.unshift(log);
    // Keep list size reasonable in UI
    if (logs.value.length > 500) {
      logs.value = logs.value.slice(0, 500);
    }
  });
});

onUnmounted(() => {
  socket.disconnect();
});

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesType = filterType.value === 'all' || log.type === filterType.value;
    const matchesSearch = searchQuery.value === '' || 
      log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesType && matchesSearch;
  });
});

const formatDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
};

const formatDetails = (details) => {
  if (!details || Object.keys(details).length === 0) return '-';
  // Remove empty values
  const clean = Object.entries(details).reduce((acc, [k, v]) => {
    if (v) acc[k] = v;
    return acc;
  }, {});
  return JSON.stringify(clean).replace(/[{"}]/g, '').replace(/,/g, ', ');
};

const getTypeLabel = (type) => {
  const labels = {
    order: 'طلب',
    user: 'مستخدم',
    product: 'منتج',
    campaign: 'حملة',
    settings: 'إعدادات',
    system: 'نظام'
  };
  return labels[type] || type;
};

const getTypeClass = (type) => {
  const classes = {
    order: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    user: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    product: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    campaign: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    settings: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    system: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };
  return classes[type] || 'bg-gray-100 text-gray-800';
};
</script>
