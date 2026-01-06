<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">إدارة الفروع</h2>
      <button @click="openModal()" class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
        إضافة فرع جديد
      </button>
    </div>

    <!-- Branches List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              اسم الفرع
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الموقع
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              رقم الهاتف
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المبيعات
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">إجراءات</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="branch in branchesStore.branches" :key="branch.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ branch.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ branch.location }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ branch.phone }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-semibold text-green-600">{{ formatCurrency(getBranchSales(branch.id)) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(branch)" class="text-primary-600 hover:text-primary-900 ml-4">تعديل</button>
              <button @click="deleteBranch(branch.id)" class="text-red-600 hover:text-red-900">حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ isEditing ? 'تعديل فرع' : 'إضافة فرع جديد' }}
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">اسم الفرع</label>
                <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">الموقع</label>
                <input v-model="form.location" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                <input v-model="form.phone" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveBranch" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
              حفظ
            </button>
            <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBranchesStore } from '../store/branches';
import { useSalesStore } from '../store/sales';
import { formatCurrency } from '../utils/currency';

const branchesStore = useBranchesStore();
const salesStore = useSalesStore();

const getBranchSales = (branchId) => {
  return salesStore.sales
    .filter(s => s.branchId === branchId)
    .reduce((sum, s) => sum + s.total, 0);
};

const showModal = ref(false);
const isEditing = ref(false);
const form = ref({
  id: null,
  name: '',
  location: '',
  phone: ''
});

const openModal = (branch = null) => {
  if (branch) {
    isEditing.value = true;
    form.value = { ...branch };
  } else {
    isEditing.value = false;
    form.value = { id: null, name: '', location: '', phone: '' };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveBranch = () => {
  if (isEditing.value) {
    branchesStore.updateBranch(form.value);
  } else {
    branchesStore.addBranch(form.value);
  }
  closeModal();
};

const deleteBranch = (id) => {
  if (confirm('هل أنت متأكد من حذف هذا الفرع؟')) {
    branchesStore.deleteBranch(id);
  }
};
</script>
