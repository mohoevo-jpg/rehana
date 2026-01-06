<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">المخزون</h2>
      
      <!-- Print Button -->
      <button
        @click="openPrintPreview"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Printer class="h-5 w-5 ml-2" />
        طباعة الجرد
      </button>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية الحالية</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.stock }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span v-if="product.stock <= 5" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                منخفض
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                متوفر
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Report Preview Modal -->
    <ReportPreviewModal
      :show="showReportPreview"
      title="طباعة تقرير المخزون"
      reportTitle="تقرير المخزون"
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
import { useProductsStore } from '../store/products';
import { Printer } from 'lucide-vue-next';
import ReportPreviewModal from '../components/common/ReportPreviewModal.vue';

const productsStore = useProductsStore();
const products = computed(() => productsStore.getAllProducts);
const showReportPreview = ref(false);

const reportSubtitle = computed(() => `تاريخ الجرد: ${new Date().toLocaleDateString('ar-IQ')}`);

const reportColumns = [
  { key: 'name', label: 'المنتج', class: 'text-right' },
  { key: 'stock', label: 'الكمية الحالية', class: 'text-center' },
  { key: 'status', label: 'الحالة', class: 'text-center' },
];

const reportData = computed(() => {
  return products.value.map(product => ({
    name: product.name,
    stock: product.stock,
    status: product.stock <= 5 ? 'منخفض' : 'متوفر'
  }));
});

const reportSummary = computed(() => {
  const totalStock = products.value.reduce((sum, p) => sum + p.stock, 0);
  
  return {
    name: 'الإجمالي',
    stock: totalStock,
  };
});

const openPrintPreview = () => {
  showReportPreview.value = true;
};
</script>
