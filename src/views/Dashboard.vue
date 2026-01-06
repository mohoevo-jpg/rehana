<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="bg-primary-100 rounded-md p-3 text-primary-600">
                <DollarSign class="h-6 w-6" />
              </div>
            </div>
            <div class="mr-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ $t('dashboard.total_sales') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ formatCurrency(stats.totalSales) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="bg-green-100 rounded-md p-3 text-green-600">
                <ShoppingCart class="h-6 w-6" />
              </div>
            </div>
            <div class="mr-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ $t('dashboard.total_orders') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.orderCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="bg-red-100 rounded-md p-3 text-red-600">
                <AlertTriangle class="h-6 w-6" />
              </div>
            </div>
            <div class="mr-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ $t('dashboard.low_stock') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.lowStock }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Sales -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          أحدث المبيعات
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الطلب
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المجموع
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sale in recentSales" :key="sale.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                #{{ sale.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(sale.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(sale.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  مكتمل
                </span>
              </td>
            </tr>
            <tr v-if="recentSales.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                لا توجد مبيعات حتى الآن
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { DollarSign, ShoppingCart, AlertTriangle } from 'lucide-vue-next';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { useSalesStore } from '../store/sales';

const salesStore = useSalesStore();

const stats = ref({
  totalSales: 0,
  orderCount: 0,
  lowStock: 3 // Mock
});

const recentSales = ref([]);

onMounted(() => {
  // In a real app, fetch from API/Store
  stats.value.totalSales = salesStore.totalRevenue;
  stats.value.orderCount = salesStore.sales.length;
  recentSales.value = salesStore.sales.slice(0, 5);
});
</script>
