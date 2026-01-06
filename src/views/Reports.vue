<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">التقارير</h2>
      
      <div class="flex gap-4">
        <!-- Print Button -->
        <button
          @click="openPrintPreview"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Printer class="h-5 w-5 ml-2" />
          طباعة التقرير
        </button>

        <!-- Period Filter -->
        <div class="flex bg-white rounded-md shadow-sm" role="group">
          <button 
            @click="period = 'daily'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-r-md border',
              period === 'daily' 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            يومي
          </button>
          <button 
            @click="period = 'weekly'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b',
              period === 'weekly' 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            أسبوعي
          </button>
          <button 
            @click="period = 'monthly'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-l-md border',
              period === 'monthly' 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            شهري
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg p-5">
        <dt class="text-sm font-medium text-gray-500 truncate">إجمالي المبيعات</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(stats.revenue) }}</dd>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg p-5">
        <dt class="text-sm font-medium text-gray-500 truncate">إجمالي الأرباح</dt>
        <dd class="mt-1 text-3xl font-semibold text-green-600">{{ formatCurrency(stats.profit) }}</dd>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg p-5">
        <dt class="text-sm font-medium text-gray-500 truncate">عدد الطلبات</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.orders }}</dd>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg p-5">
        <dt class="text-sm font-medium text-gray-500 truncate">متوسط قيمة الطلب</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ formatCurrency(stats.averageOrder) }}</dd>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">المبيعات حسب الفرع ({{ periodLabel }})</h3>
        <div class="h-64">
          <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
          <p v-else class="text-center text-gray-500 mt-10">لا توجد بيانات كافية</p>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">أفضل الموظفين ({{ periodLabel }})</h3>
        <div class="space-y-4 max-h-64 overflow-y-auto">
          <div v-for="user in topUsers" :key="user.id" class="flex items-center justify-between border-b pb-2">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold ml-3">
                {{ user.name.charAt(0) }}
              </div>
              <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
            </div>
            <div class="text-left">
              <div class="text-sm font-medium text-gray-900">{{ formatCurrency(user.sales) }}</div>
              <div class="text-xs text-gray-500">{{ user.orders }} طلب</div>
            </div>
          </div>
          <div v-if="topUsers.length === 0" class="text-center text-gray-500 mt-10">
            لا توجد بيانات
          </div>
        </div>
      </div>
    </div>

    <!-- Sold Items Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">تفاصيل المنتجات المباعة ({{ periodLabel }})</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المنتج
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الكمية المباعة
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                إجمالي المبيعات
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                إجمالي الأرباح
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in soldItems" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                <div class="text-xs text-gray-500">{{ item.category }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.quantity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(item.revenue) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                {{ formatCurrency(item.profit) }}
              </td>
            </tr>
            <tr v-if="soldItems.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                لا توجد مبيعات في هذه الفترة
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Report Preview Modal -->
    <ReportPreviewModal
      :show="showReportPreview"
      title="طباعة التقرير"
      :reportTitle="reportTitle"
      :subtitle="reportSubtitle"
      :columns="reportColumns"
      :data="reportData"
      :summary="reportSummary"
      @close="showReportPreview = false"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useSalesStore } from '../store/sales';
import { useBranchesStore } from '../store/branches';
import { useUsersStore } from '../store/users';
import { useProductsStore } from '../store/products';
import { formatCurrency } from '../utils/currency';
import { Printer } from 'lucide-vue-next';
import ReportPreviewModal from '../components/common/ReportPreviewModal.vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const salesStore = useSalesStore();
const branchesStore = useBranchesStore();
const usersStore = useUsersStore();
const productsStore = useProductsStore();

const period = ref('daily');
const showReportPreview = ref(false);

const periodLabel = computed(() => {
  switch (period.value) {
    case 'daily': return 'اليوم';
    case 'weekly': return 'هذا الأسبوع';
    case 'monthly': return 'هذا الشهر';
    default: return '';
  }
});

const reportTitle = computed(() => 'تقرير المبيعات التفصيلي');
const reportSubtitle = computed(() => `للفترة: ${periodLabel.value}`);

const reportColumns = [
  { key: 'name', label: 'المنتج', class: 'text-right' },
  { key: 'quantity', label: 'الكمية', class: 'text-center' },
  { key: 'revenue', label: 'المبيعات', class: 'text-left' },
  { key: 'profit', label: 'الأرباح', class: 'text-left' },
];

const reportData = computed(() => {
  return soldItems.value.map(item => ({
    name: item.name,
    quantity: item.quantity,
    revenue: formatCurrency(item.revenue),
    profit: formatCurrency(item.profit)
  }));
});

const reportSummary = computed(() => {
  const totalQty = soldItems.value.reduce((sum, item) => sum + item.quantity, 0);
  return {
    name: 'الإجمالي',
    quantity: totalQty,
    revenue: formatCurrency(stats.value.revenue),
    profit: formatCurrency(stats.value.profit)
  };
});

const openPrintPreview = () => {
  showReportPreview.value = true;
};

// Filter Sales by Period
const filteredSales = computed(() => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  return salesStore.sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const saleTime = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate()).getTime();
    
    if (period.value === 'daily') {
      return saleTime === today;
    } else if (period.value === 'weekly') {
      const oneWeekAgo = today - (7 * 24 * 60 * 60 * 1000);
      return saleTime >= oneWeekAgo && saleTime <= today;
    } else if (period.value === 'monthly') {
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }
    return true;
  });
});

// Calculate Stats
const stats = computed(() => {
  const sales = filteredSales.value;
  const revenue = sales.reduce((sum, s) => sum + s.total, 0);
  const orders = sales.length;
  
  // Calculate Profit
  // Profit = Revenue - Cost
  // We need to iterate through all items in all sales
  let totalCost = 0;
  sales.forEach(sale => {
    sale.items.forEach(item => {
      // Try to get cost from item snapshot, or fallback to current product cost
      const costPrice = item.costPrice || productsStore.getProductById(item.id)?.costPrice || 0;
      totalCost += costPrice * item.quantity;
    });
  });
  
  const profit = revenue - totalCost;
  
  return {
    revenue,
    orders,
    averageOrder: orders ? revenue / orders : 0,
    profit
  };
});

// Chart Data (Filtered)
const chartData = computed(() => {
  const branches = branchesStore.branches;
  const labels = branches.map(b => b.name);
  const data = branches.map(b => {
    return filteredSales.value
      .filter(s => s.branchId === b.id)
      .reduce((sum, s) => sum + s.total, 0);
  });

  return {
    labels,
    datasets: [
      {
        label: 'المبيعات',
        backgroundColor: '#0ea5e9',
        data
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
};

// Top Users (Filtered)
const topUsers = computed(() => {
  const users = usersStore.users;
  return users.map(u => {
    const userSales = filteredSales.value.filter(s => s.userId === u.id);
    const revenue = userSales.reduce((sum, s) => sum + s.total, 0);
    
    return { 
      id: u.id, 
      name: u.name, 
      sales: revenue,
      orders: userSales.length
    };
  })
  .filter(u => u.sales > 0)
  .sort((a, b) => b.sales - a.sales)
  .slice(0, 5);
});

// Sold Items Analysis
const soldItems = computed(() => {
  const itemsMap = {};
  
  filteredSales.value.forEach(sale => {
    sale.items.forEach(item => {
      if (!itemsMap[item.id]) {
        itemsMap[item.id] = {
          id: item.id,
          name: item.name,
          category: item.category,
          quantity: 0,
          revenue: 0,
          cost: 0
        };
      }
      
      const qty = item.quantity;
      const revenue = item.price * qty;
      const costPrice = item.costPrice || productsStore.getProductById(item.id)?.costPrice || 0;
      const cost = costPrice * qty;
      
      itemsMap[item.id].quantity += qty;
      itemsMap[item.id].revenue += revenue;
      itemsMap[item.id].cost += cost;
    });
  });
  
  return Object.values(itemsMap).map(item => ({
    ...item,
    profit: item.revenue - item.cost
  })).sort((a, b) => b.revenue - a.revenue);
});
</script>
