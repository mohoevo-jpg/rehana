<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">إدارة المستخدمين</h2>
      <button @click="openModal()" class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
        إضافة مستخدم جديد
      </button>
    </div>

    <!-- Users List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الاسم
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              اسم المستخدم
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الدور
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الفرع
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">إجراءات</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in usersStore.users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ user.username }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ getBranchName(user.branchId) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(user)" class="text-primary-600 hover:text-primary-900 ml-4">تعديل</button>
              <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">حذف</button>
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
              {{ isEditing ? 'تعديل مستخدم' : 'إضافة مستخدم جديد' }}
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">الاسم الكامل</label>
                <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">اسم المستخدم</label>
                <input v-model="form.username" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  كلمة المرور
                  <span v-if="isEditing" class="text-xs text-gray-500 font-normal">(اتركه فارغاً للإبقاء على كلمة المرور الحالية)</span>
                </label>
                <input v-model="form.password" type="password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" :placeholder="isEditing ? '••••••' : ''">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">الدور</label>
                <select v-model="form.role" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="admin">مدير</option>
                  <option value="manager">مشرف</option>
                  <option value="cashier">كاشير</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">الفرع</label>
                <select v-model="form.branchId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option v-for="branch in branchesStore.branches" :key="branch.id" :value="branch.id">
                    {{ branch.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">صلاحيات الوصول</label>
                <div class="space-y-2 max-h-40 overflow-y-auto border p-2 rounded-md">
                  <div class="flex items-center">
                    <input type="checkbox" id="perm-all" value="all" v-model="form.permissions" class="ml-2">
                    <label for="perm-all" class="text-sm text-gray-700 font-bold">جميع الصلاحيات</label>
                  </div>
                  <div v-for="perm in availablePermissions" :key="perm.key" class="flex items-center">
                    <input type="checkbox" :id="'perm-' + perm.key" :value="perm.key" v-model="form.permissions" class="ml-2" :disabled="form.permissions.includes('all')">
                    <label :for="'perm-' + perm.key" class="text-sm text-gray-700">{{ perm.label }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveUser" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
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
import { useUsersStore } from '../store/users';
import { useBranchesStore } from '../store/branches';

const usersStore = useUsersStore();
const branchesStore = useBranchesStore();

const showModal = ref(false);
const isEditing = ref(false);
const form = ref({
  id: null,
  name: '',
  username: '',
  password: '',
  role: 'cashier',
  branchId: '',
  permissions: []
});

const availablePermissions = [
  { key: 'dashboard', label: 'لوحة التحكم' },
  { key: 'cashier', label: 'الكاشير' },
  { key: 'products', label: 'المنتجات' },
  { key: 'sales', label: 'المبيعات' },
  { key: 'stock', label: 'المخزون' },
  { key: 'reports', label: 'التقارير' },
  { key: 'chat', label: 'الدردشة' },
  { key: 'users', label: 'المستخدمين' },
  { key: 'branches', label: 'الفروع' },
  { key: 'settings', label: 'الإعدادات' }
];

const getBranchName = (branchId) => {
  const branch = branchesStore.getBranchById(branchId);
  return branch ? branch.name : 'غير محدد';
};

const openModal = (user = null) => {
  if (user) {
    isEditing.value = true;
    // Don't fill password on edit
    form.value = { ...user, permissions: user.permissions || [], password: '' };
  } else {
    isEditing.value = false;
    form.value = {
      id: null,
      name: '',
      username: '',
      password: '',
      role: 'cashier',
      branchId: branchesStore.branches[0]?.id || '',
      permissions: []
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveUser = () => {
  if (isEditing.value) {
    usersStore.updateUser(form.value);
  } else {
    usersStore.addUser(form.value);
  }
  closeModal();
};

const deleteUser = (id) => {
  if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
    usersStore.deleteUser(id);
  }
};
</script>
