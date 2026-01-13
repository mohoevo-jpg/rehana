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
    
    <div class="bg-white shadow rounded-lg mt-6">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg leading-6 font-medium text-gray-900">التصنيفات</h3>
        <button @click="openAddCategoryModal" class="inline-flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700">
          <Plus class="w-4 h-4" /> إضافة تصنيف
        </button>
      </div>
      <div class="p-4 sm:p-6">
        <div v-if="categories.length === 0" class="text-center text-sm text-gray-500">لا توجد تصنيفات</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="cat in categories" :key="cat.id" class="border rounded-lg p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xl">📦</div>
              <div>
                <div class="font-semibold text-gray-900">{{ cat.name }}</div>
                <div class="text-xs text-gray-500">{{ cat.icon || 'بدون أيقونة' }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openEditCategoryModal(cat)" class="p-2 rounded hover:bg-blue-50 text-blue-600">
                <Edit class="w-5 h-5" />
              </button>
              <button @click="deleteCategory(cat.id)" class="p-2 rounded hover:bg-red-50 text-red-600">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg mt-6">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg leading-6 font-medium text-gray-900">الإعلانات</h3>
        <button @click="openAddBannerModal" class="inline-flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700">
          <Plus class="w-4 h-4" /> إضافة إعلان
        </button>
      </div>
      <div class="p-4 sm:p-6">
        <div v-if="banners.length === 0" class="text-center text-sm text-gray-500">لا توجد إعلانات</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="bn in banners" :key="bn.id" class="rounded-lg p-4 text-white" :class="`bg-gradient-to-r from-${bn.colorFrom} to-${bn.colorTo}`">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-lg font-bold">{{ bn.title }}</div>
                <div class="text-sm opacity-90">{{ bn.subtitle }}</div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="openEditBannerModal(bn)" class="p-2 rounded bg-white/20 hover:bg-white/30">
                  <Edit class="w-5 h-5" />
                </button>
                <button @click="deleteBanner(bn.id)" class="p-2 rounded bg-white/20 hover:bg-white/30">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCategoryModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg w-full max-w-md p-6 relative">
        <div class="text-lg font-semibold mb-4">{{ newCategory.id ? 'تعديل تصنيف' : 'إضافة تصنيف' }}</div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">اسم التصنيف</label>
            <input v-model="newCategory.name" type="text" class="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">الأيقونة</label>
            <input v-model="newCategory.icon" type="text" class="w-full border rounded-md px-3 py-2" />
          </div>
          <button @click="saveCategory" class="w-full py-2 bg-primary-600 text-white rounded-md font-semibold">
            {{ newCategory.id ? 'حفظ التعديلات' : 'إضافة' }}
          </button>
          <button @click="showCategoryModal = false" class="w-full py-2 mt-2 bg-gray-100 text-gray-800 rounded-md font-semibold">
            إلغاء
          </button>
        </div>
      </div>
    </div>

    <div v-if="showBannerModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg w-full max-w-md p-6 relative">
        <div class="text-lg font-semibold mb-4">{{ newBanner.id ? 'تعديل إعلان' : 'إضافة إعلان' }}</div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
            <input v-model="newBanner.title" type="text" class="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">النص</label>
            <input v-model="newBanner.subtitle" type="text" class="w-full border rounded-md px-3 py-2" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">لون البداية</label>
              <select v-model="newBanner.colorFrom" class="w-full border rounded-md px-3 py-2">
                <option value="violet-600">Violet</option>
                <option value="indigo-600">Indigo</option>
                <option value="sky-500">Sky</option>
                <option value="emerald-500">Emerald</option>
                <option value="red-500">Red</option>
                <option value="orange-500">Orange</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">لون النهاية</label>
              <select v-model="newBanner.colorTo" class="w-full border rounded-md px-3 py-2">
                <option value="indigo-600">Indigo</option>
                <option value="violet-600">Violet</option>
                <option value="sky-500">Sky</option>
                <option value="emerald-500">Emerald</option>
                <option value="red-500">Red</option>
                <option value="orange-500">Orange</option>
              </select>
            </div>
          </div>
          <button @click="saveBanner" class="w-full py-2 bg-primary-600 text-white rounded-md font-semibold">
            {{ newBanner.id ? 'حفظ التعديلات' : 'إضافة' }}
          </button>
          <button @click="showBannerModal = false" class="w-full py-2 mt-2 bg-gray-100 text-gray-800 rounded-md font-semibold">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { DollarSign, ShoppingCart, AlertTriangle, Plus, Edit, Trash2 } from 'lucide-vue-next';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { useSalesStore } from '../store/sales';
import api from '../services/api';

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
  fetchCategories();
  fetchBanners();
});

const categories = ref([]);
const banners = ref([]);

const showCategoryModal = ref(false);
const showBannerModal = ref(false);

const newCategory = ref({ id: null, name: '', icon: '' });
const newBanner = ref({ id: null, title: '', subtitle: '', colorFrom: 'violet-600', colorTo: 'indigo-600' });

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    categories.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('Failed to fetch categories', e);
  }
};

const fetchBanners = async () => {
  try {
    const res = await api.get('/banners');
    banners.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('Failed to fetch banners', e);
  }
};

const openAddCategoryModal = () => {
  newCategory.value = { id: null, name: '', icon: '' };
  showCategoryModal.value = true;
};

const openEditCategoryModal = (cat) => {
  newCategory.value = { id: cat.id, name: cat.name, icon: cat.icon || '' };
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  try {
    if (newCategory.value.id) {
      const res = await api.put(`/categories/${newCategory.value.id}`, {
        name: newCategory.value.name,
        icon: newCategory.value.icon
      });
      const updated = res.data?.category || res.data;
      const idx = categories.value.findIndex(c => c.id === updated.id);
      if (idx !== -1) categories.value[idx] = updated;
    } else {
      const res = await api.post('/categories', {
        name: newCategory.value.name,
        icon: newCategory.value.icon
      });
      const created = res.data?.category || res.data;
      categories.value.push(created);
    }
    showCategoryModal.value = false;
  } catch (e) {
    console.error('Failed to save category', e);
  }
};

const deleteCategory = async (id) => {
  if (!id) return;
  try {
    await api.delete(`/categories/${id}`);
    categories.value = categories.value.filter(c => c.id !== id);
  } catch (e) {
    console.error('Failed to delete category', e);
  }
};

const openAddBannerModal = () => {
  newBanner.value = { id: null, title: '', subtitle: '', colorFrom: 'violet-600', colorTo: 'indigo-600' };
  showBannerModal.value = true;
};

const openEditBannerModal = (banner) => {
  newBanner.value = {
    id: banner.id,
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    colorFrom: banner.colorFrom || 'violet-600',
    colorTo: banner.colorTo || 'indigo-600'
  };
  showBannerModal.value = true;
};

const saveBanner = async () => {
  try {
    const payload = {
      title: newBanner.value.title,
      subtitle: newBanner.value.subtitle,
      colorFrom: newBanner.value.colorFrom,
      colorTo: newBanner.value.colorTo
    };
    if (newBanner.value.id) {
      const res = await api.put(`/banners/${newBanner.value.id}`, payload);
      const updated = res.data?.banner || res.data;
      const idx = banners.value.findIndex(b => b.id === updated.id);
      if (idx !== -1) banners.value[idx] = updated;
    } else {
      const res = await api.post('/banners', payload);
      const created = res.data?.banner || res.data;
      banners.value.push(created);
    }
    showBannerModal.value = false;
  } catch (e) {
    console.error('Failed to save banner', e);
  }
};

const deleteBanner = async (id) => {
  if (!id) return;
  try {
    await api.delete(`/banners/${id}`);
    banners.value = banners.value.filter(b => b.id !== id);
  } catch (e) {
    console.error('Failed to delete banner', e);
  }
};
</script>
