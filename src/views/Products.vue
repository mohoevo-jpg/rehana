<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">إدارة المنتجات</h2>
      <div class="flex gap-2">
        <button 
          @click="openPrintPreview()"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Printer class="w-5 h-5" />
          طباعة تقرير
        </button>
        <button 
          @click="openModal()"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus class="w-5 h-5" />
          إضافة منتج
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="productsStore.loading" class="p-6 text-center text-gray-500">
        جاري التحميل...
      </div>
      <div v-else-if="productsStore.error" class="p-6 text-center text-red-500">
        حدث خطأ: {{ productsStore.error }}
        <button @click="productsStore.fetchProducts()" class="mr-2 text-indigo-600 underline">إعادة المحاولة</button>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القسم</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر الشراء</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر البيع</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المخزون</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الباركود</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(product.costPrice || 0) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(product.price) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.stock }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.barcode }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
              <button @click="printBarcode(product)" class="text-gray-600 hover:text-gray-900" title="طباعة باركود">
                <Printer class="w-5 h-5" />
              </button>
              <button @click="openModal(product)" class="text-indigo-600 hover:text-indigo-900">تعديل</button>
              <button @click="deleteProd(product.id)" class="text-red-600 hover:text-red-900">حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <AppModal 
      :show="showModal" 
      :title="editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'"
      @close="showModal = false"
      @confirm="saveProduct"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">اسم المنتج</label>
          <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">سعر الشراء</label>
            <input v-model.number="form.costPrice" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">سعر البيع</label>
            <input v-model.number="form.price" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">سعر الخصم</label>
            <input v-model.number="form.discountPrice" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="اختياري">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">الكمية</label>
            <input v-model.number="form.stock" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          </div>
          <div>
             <label class="block text-sm font-medium text-gray-700">القسم</label>
             <input v-model="form.category" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">رابط الصورة</label>
          <input v-model="form.image" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="https://...">
        </div>
        <div class="flex items-center gap-2">
          <input v-model="form.isAvailable" type="checkbox" id="isAvailable" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
          <label for="isAvailable" class="text-sm font-medium text-gray-700">متاح للبيع</label>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">الباركود</label>
          <div class="flex gap-2">
            <input v-model="form.barcode" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <button @click="generateBarcode" type="button" class="mt-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300">
              توليد
            </button>
          </div>
        </div>
      </div>
    </AppModal>

    <!-- Barcode Preview Modal -->
    <AppModal 
      :show="showBarcodePreviewModal" 
      title="معاينة الباركود"
      confirmText="طباعة"
      cancelText="إغلاق"
      @close="showBarcodePreviewModal = false"
      @confirm="executePrint"
    >
      <div class="flex flex-col items-center justify-center p-4 space-y-4">
        <div class="bg-white p-4 border rounded shadow-sm">
          <canvas ref="previewCanvas"></canvas>
        </div>
        <p class="text-sm text-gray-500">سيتم طباعة الباركود بالشكل الظاهر أعلاه</p>
      </div>
    </AppModal>

    <!-- Report Preview Modal -->
    <ReportPreviewModal
      :show="showReportPreview"
      title="تقرير المنتجات"
      :data="reportData"
      :columns="reportColumns"
      :summary="reportSummary"
      :subtitle="reportSubtitle"
      @close="showReportPreview = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { Plus, Printer } from 'lucide-vue-next';
import { useProductsStore } from '../store/products';
import { useSettingsStore } from '../store/settings';
import { formatCurrency } from '../utils/currency';
import AppModal from '../components/common/AppModal.vue';
import ReportPreviewModal from '../components/common/ReportPreviewModal.vue';
import JsBarcode from 'jsbarcode';

const productsStore = useProductsStore();
const settingsStore = useSettingsStore();
const products = computed(() => productsStore.getAllProducts);

onMounted(() => {
  productsStore.fetchProducts();
});

const showModal = ref(false);
const showBarcodePreviewModal = ref(false);
const showReportPreview = ref(false);
const previewCanvas = ref(null);
const editingProduct = ref(null);

const reportSubtitle = computed(() => `تاريخ الطباعة: ${new Date().toLocaleDateString('ar-IQ')}`);

const reportColumns = [
  { key: 'name', label: 'المنتج', class: 'text-right' },
  { key: 'category', label: 'القسم', class: 'text-center' },
  { key: 'price', label: 'السعر', class: 'text-left' },
  { key: 'stock', label: 'المخزون', class: 'text-center' },
];

const reportData = computed(() => {
  return products.value.map(product => ({
    name: product.name,
    category: product.category,
    price: formatCurrency(product.price),
    stock: product.stock
  }));
});

const reportSummary = computed(() => {
  return {
    name: 'العدد الكلي',
    category: products.value.length + ' منتج',
  };
});

const openPrintPreview = () => {
  showReportPreview.value = true;
};

const form = ref({
  name: '',
  price: 0,
  costPrice: 0,
  stock: 0,
  category: '',
  barcode: '',
  discountPrice: 0,
  isAvailable: true,
  image: ''
});

const openModal = (product = null) => {
  editingProduct.value = product;
  if (product) {
    form.value = { 
      ...product,
      // Ensure defaults if missing
      discountPrice: product.discountPrice || 0,
      isAvailable: product.isAvailable !== false,
      image: product.images && product.images.length > 0 ? product.images[0] : (product.image || '')
    };
  } else {
    form.value = { 
      name: '', 
      price: 0, 
      costPrice: 0, 
      stock: 0, 
      category: '', 
      barcode: '',
      discountPrice: 0,
      isAvailable: true,
      image: ''
    };
  }
  showModal.value = true;
};

const saveProduct = () => {
  const productData = { ...form.value };
  // Sync image to images array for mobile app compatibility
  if (productData.image) {
    productData.images = [productData.image];
  } else {
    productData.images = [];
  }

  if (editingProduct.value) {
    productsStore.updateProduct({ ...productData, id: editingProduct.value.id });
  } else {
    // Generate barcode if not provided
    if (!productData.barcode) {
      productData.barcode = Math.floor(Math.random() * 1000000000000).toString();
    }
    productsStore.addProduct(productData);
  }
  showModal.value = false;
};

const deleteProd = (id) => {
  if (confirm('هل أنت متأكد من الحذف؟')) {
    productsStore.deleteProduct(id);
  }
};

const generateBarcode = () => {
  form.value.barcode = Math.floor(Math.random() * 1000000000000).toString();
};

const currentPreviewProduct = ref(null);

const printBarcode = async (product) => {
  if (!product.barcode) {
    alert('لا يوجد باركود لهذا المنتج');
    return;
  }
  
  currentPreviewProduct.value = product;
  showBarcodePreviewModal.value = true;
  
  await nextTick();
  
  const settings = settingsStore;
  try {
    JsBarcode(previewCanvas.value, product.barcode, {
      format: settings.barcodeFormat,
      displayValue: settings.barcodeShowText,
      text: settings.barcodeShowText ? (product.name + ' - ' + formatCurrency(product.price)) : undefined,
      width: settings.barcodeWidth,
      height: settings.barcodeHeight,
      fontSize: settings.barcodeFontSize,
      margin: settings.barcodeMargin
    });
  } catch (error) {
    console.error(error);
    alert('حدث خطأ أثناء عرض الباركود');
  }
};

const executePrint = () => {
  if (!previewCanvas.value) return;
  
  try {
    const dataUrl = previewCanvas.value.toDataURL();
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write('<html><head><title>Print Barcode</title>');
    printWindow.document.write('<style>body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<img src="${dataUrl}" />`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Wait for image to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      showBarcodePreviewModal.value = false;
    };
  } catch (error) {
    console.error(error);
    alert('حدث خطأ أثناء الطباعة');
  }
};
</script>
