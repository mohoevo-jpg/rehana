<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">سجل المبيعات</h2>
      
      <!-- Print Button -->
      <button
        @click="openPrintPreview"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Printer class="h-5 w-5 ml-2" />
        طباعة السجل
      </button>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد العناصر</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المجموع</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">طريقة الدفع</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="sale in sales" :key="sale.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ sale.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(sale.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sale.items.length }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ formatCurrency(sale.total) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span :class="{'px-2 py-1 rounded-full text-xs font-semibold': true, 'bg-green-100 text-green-800': sale.payment.method === 'cash', 'bg-blue-100 text-blue-800': sale.payment.method === 'card'}">
                {{ sale.payment.method === 'cash' ? 'نقدي' : 'بطاقة' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Report Preview Modal -->
    <ReportPreviewModal
      :show="showReportPreview"
      title="طباعة سجل المبيعات"
      reportTitle="سجل المبيعات"
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
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { Printer } from 'lucide-vue-next';
import ReportPreviewModal from '../components/common/ReportPreviewModal.vue';

const salesStore = useSalesStore();
const sales = computed(() => salesStore.sales);
const showReportPreview = ref(false);

const reportSubtitle = computed(() => `تاريخ الطباعة: ${new Date().toLocaleDateString('ar-IQ')}`);

const reportColumns = [
  { key: 'id', label: 'رقم الطلب', class: 'text-right' },
  { key: 'date', label: 'التاريخ', class: 'text-center' },
  { key: 'itemsCount', label: 'عدد العناصر', class: 'text-center' },
  { key: 'total', label: 'المجموع', class: 'text-left' },
  { key: 'paymentMethod', label: 'طريقة الدفع', class: 'text-left' },
];

const reportData = computed(() => {
  return sales.value.map(sale => ({
    id: `#${sale.id}`,
    date: formatDate(sale.date),
    itemsCount: sale.items.length,
    total: formatCurrency(sale.total),
    paymentMethod: sale.payment.method === 'cash' ? 'نقدي' : 'بطاقة'
  }));
});

const reportSummary = computed(() => {
  const totalRevenue = sales.value.reduce((sum, sale) => sum + sale.total, 0);
  const totalItems = sales.value.reduce((sum, sale) => sum + sale.items.length, 0);
  
  return {
    id: 'الإجمالي',
    itemsCount: totalItems,
    total: formatCurrency(totalRevenue)
  };
});

const openPrintPreview = () => {
  showReportPreview.value = true;
};
</script>
