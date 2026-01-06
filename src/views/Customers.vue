<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">{{ $t('menu.customers') }}</h2>
      <button @click="openModal()" class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2">
        <Plus class="w-5 h-5" />
        {{ $t('customers.add_customer') }}
      </button>
    </div>

    <!-- Customers List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ $t('customers.name') }}
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ $t('customers.phone') }}
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ $t('customers.address') }}
            </th>
             <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ $t('customers.notes') }}
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">إجراءات</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="customer in customersStore.customers" :key="customer.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
              <div class="text-xs text-gray-500">{{ customer.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ customer.phone }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ customer.address }}</div>
            </td>
             <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 truncate max-w-xs">{{ customer.notes }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
              <button @click="openPaymentModal(customer)" class="text-green-600 hover:text-green-900 flex items-center gap-1" title="تسديد دفعة">
                <DollarSign class="w-4 h-4" />
              </button>
              <button @click="printReport(customer)" class="text-indigo-600 hover:text-indigo-900 flex items-center gap-1" title="تقرير المشتريات">
                <FileText class="w-4 h-4" />
              </button>
              <button @click="openModal(customer)" class="text-primary-600 hover:text-primary-900 flex items-center gap-1">
                <Edit class="w-4 h-4" />
              </button>
              <button @click="deleteCustomer(customer.id)" class="text-red-600 hover:text-red-900 flex items-center gap-1">
                <Trash2 class="w-4 h-4" />
              </button>
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
              {{ isEditing ? 'تعديل بيانات العميل' : 'إضافة عميل جديد' }}
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">{{ $t('customers.name') }}</label>
                <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">{{ $t('customers.phone') }}</label>
                <input v-model="form.phone" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">{{ $t('customers.email') }}</label>
                <input v-model="form.email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">{{ $t('customers.address') }}</label>
                <input v-model="form.address" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              </div>
               <div>
                <label class="block text-sm font-medium text-gray-700">{{ $t('customers.notes') }}</label>
                <textarea v-model="form.notes" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows="3"></textarea>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveCustomer" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
              {{ $t('common.save') }}
            </button>
            <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closePaymentModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              تسديد دفعة للعميل
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">المبلغ المدفوع</label>
                <div class="relative mt-1">
                  <input v-model.number="paymentForm.amount" type="number" class="block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-8">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">ملاحظات</label>
                <textarea v-model="paymentForm.notes" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows="3"></textarea>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="savePayment" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
              حفظ الدفعة
            </button>
            <button @click="closePaymentModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Report Preview Modal -->
    <ReportPreviewModal
      :show="showReportPreview"
      title="كشف حساب عميل"
      :reportTitle="reportTitle"
      :subtitle="reportSubtitle"
      :columns="reportColumns"
      :data="reportData"
      :summary="reportSummary"
      :allow-receipt="true"
      @close="showReportPreview = false"
      @print-receipt="handlePrintReceipt"
    >
      <template #cell-type="{ row }">
        <span :class="{
          'px-2 py-1 rounded-full text-xs font-bold': true,
          'bg-green-100 text-green-800': row.isPayment,
          'bg-red-100 text-red-800': row.isCredit,
          'bg-gray-100 text-gray-800': !row.isPayment && !row.isCredit
        }">
          {{ row.typeLabel }}
        </span>
      </template>
      
      <template #cell-items="{ row }">
        <div v-if="row.isPayment" class="text-sm text-gray-600 italic">
          {{ row.itemsText }}
        </div>
        <div v-else class="text-sm">
          <div v-for="(item, idx) in row.rawItems" :key="idx" class="mb-1 last:mb-0">
            - {{ item.name }} ({{ item.quantity }})
          </div>
        </div>
      </template>

      <template #cell-total="{ row }">
        <span :class="{
          'font-bold dir-ltr block text-left': true,
          'text-green-600': row.isPayment,
          'text-red-600': row.isCredit,
          'text-gray-900': !row.isPayment && !row.isCredit
        }">
          {{ formatCurrency(row.totalAmount) }}
        </span>
      </template>
    </ReportPreviewModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCustomersStore } from '../store/customers';
import { useSalesStore } from '../store/sales';
import { useSettingsStore } from '../store/settings';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { Plus, Edit, Trash2, FileText, DollarSign } from 'lucide-vue-next';
import ReportPreviewModal from '../components/common/ReportPreviewModal.vue';

const customersStore = useCustomersStore();
const salesStore = useSalesStore();
const settingsStore = useSettingsStore();

const showModal = ref(false);
const showPaymentModal = ref(false);
const showReportPreview = ref(false);
const reportData = ref([]);
const reportColumns = ref([
  { key: 'date', label: 'التاريخ' },
  { key: 'id', label: 'رقم الفاتورة' },
  { key: 'type', label: 'النوع' },
  { key: 'items', label: 'التفاصيل' },
  { key: 'total', label: 'المبلغ' }
]);
const reportSummary = ref({});
const currentReportCustomer = ref(null);
const reportTitle = ref('');
const reportSubtitle = ref('');

const isEditing = ref(false);
const form = ref({
  id: null,
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: ''
});

const paymentForm = ref({
  customerId: null,
  amount: 0,
  notes: ''
});

const openModal = (customer = null) => {
  if (customer) {
    isEditing.value = true;
    form.value = { ...customer };
  } else {
    isEditing.value = false;
    form.value = { id: null, name: '', phone: '', email: '', address: '', notes: '' };
  }
  showModal.value = true;
};

const openPaymentModal = (customer) => {
  paymentForm.value = {
    customerId: customer.id,
    amount: 0,
    notes: ''
  };
  showPaymentModal.value = true;
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
};

const savePayment = () => {
  if (paymentForm.value.amount <= 0) return;
  
  // Create a negative sale to represent payment
  const paymentRecord = {
    id: Date.now(), // Unique ID for the payment transaction
    items: [], // No items
    subtotal: -paymentForm.value.amount,
    discount: 0,
    total: -paymentForm.value.amount, // Negative total reduces the debt
    payment: { method: 'cash' }, // Payment method for the repayment itself
    date: new Date(),
    userId: null, // Could be current user
    branchId: null, 
    customerId: paymentForm.value.customerId,
    customerName: customersStore.getCustomerById(paymentForm.value.customerId)?.name,
    isPayment: true, // Flag to distinguish
    notes: paymentForm.value.notes
  };

  salesStore.addSale(paymentRecord);
  closePaymentModal();
};

const closeModal = () => {
  showModal.value = false;
};

const saveCustomer = () => {
  if (isEditing.value) {
    customersStore.updateCustomer(form.value);
  } else {
    customersStore.addCustomer(form.value);
  }
  closeModal();
};

const deleteCustomer = (id) => {
  if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
    customersStore.deleteCustomer(id);
  }
};

const printReport = (customer) => {
  currentReportCustomer.value = customer;
  
  // Get sales for this customer
  const customerSales = salesStore.sales.filter(s => s.customerId === customer.id);
  
  // Calculate totals
  const totalPurchases = customerSales
    .filter(s => !s.isPayment)
    .reduce((sum, s) => sum + s.total, 0);
    
  const totalCredit = customerSales.filter(s => s.payment.method === 'credit').reduce((sum, s) => sum + s.total, 0);
  const totalPayments = customerSales.filter(s => s.isPayment).reduce((sum, s) => sum + Math.abs(s.total), 0);
  const currentDebt = totalCredit - totalPayments;

  // Prepare Report Data
  reportTitle.value = `كشف حساب عميل: ${customer.name}`;
  reportSubtitle.value = `الهاتف: ${customer.phone} | العنوان: ${customer.address || '-'}`;
  
  reportData.value = customerSales.map(sale => {
    const isCredit = sale.payment.method === 'credit';
    const isPayment = sale.isPayment;
    
    let typeLabel = isPayment ? 'تسديد دفعة' : (isCredit ? 'آجل' : 'نقدي');
    let itemsText = '';
    
    if (isPayment) {
      itemsText = sale.notes || 'تسديد نقدي';
    } else {
      itemsText = sale.items.map(i => `${i.name} (${i.quantity})`).join('، ');
    }

    return {
      date: formatDate(sale.date),
      id: `#${sale.id}`,
      type: typeLabel, // For raw text
      typeLabel: typeLabel, // For slot logic
      items: itemsText, // For raw text
      itemsText: itemsText,
      rawItems: sale.items || [],
      total: formatCurrency(sale.total),
      totalAmount: sale.total,
      isPayment,
      isCredit
    };
  });
  
  reportSummary.value = {
    date: '',
    id: '',
    type: '',
    items: `مشتريات: ${formatCurrency(totalPurchases)} | مسدد: ${formatCurrency(totalPayments)} | ديون: ${formatCurrency(totalCredit)}`,
    total: formatCurrency(currentDebt)
  };
  
  showReportPreview.value = true;
};

const handlePrintReceipt = () => {
  const customer = currentReportCustomer.value;
  if (!customer) return;

  const settings = settingsStore;
  const paperWidth = settings.invoicePaperSize || '80mm';
  const fontSize = (settings.invoiceFontSize || 12) + 'px';
  const baseFontSize = (settings.invoiceFontSize || 12);
  
  // Recalculate totals
  const customerSales = salesStore.sales.filter(s => s.customerId === customer.id);
  const totalPurchases = customerSales.filter(s => !s.isPayment).reduce((sum, s) => sum + s.total, 0);
  const totalCredit = customerSales.filter(s => s.payment.method === 'credit').reduce((sum, s) => sum + s.total, 0);
  const totalPayments = customerSales.filter(s => s.isPayment).reduce((sum, s) => sum + Math.abs(s.total), 0);
  const currentDebt = totalCredit - totalPayments;

  // Generate rows
  const rowsHtml = reportData.value.map(row => `
    <tr>
      <td style="border-bottom: 1px dashed #eee; padding: 4px 0;">${row.date}</td>
      <td style="border-bottom: 1px dashed #eee; padding: 4px 0;">${row.typeLabel}</td>
      <td style="border-bottom: 1px dashed #eee; padding: 4px 0; font-weight: bold; direction: ltr;">${row.total}</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <title>كشف حساب - ${customer.name}</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; padding: 5px; width: ${paperWidth}; margin: 0 auto; font-size: ${fontSize}; }
          .header { text-align: center; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 10px; }
          .header h2 { margin: 0; font-size: ${baseFontSize + 2}px; }
          .customer-info { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; font-size: ${fontSize}; }
          th { text-align: right; border-bottom: 1px solid #000; padding: 5px 0; }
          .summary { margin-top: 15px; border-top: 2px solid #000; padding-top: 10px; }
          .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .footer { margin-top: 20px; text-align: center; font-size: ${fontSize}; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${settings.shopName}</h2>
          <p>${settings.phone}</p>
          <h3>كشف حساب عميل</h3>
        </div>
        
        <div class="customer-info">
          <div><strong>العميل:</strong> ${customer.name}</div>
          <div><strong>الهاتف:</strong> ${customer.phone}</div>
          <div><strong>التاريخ:</strong> ${formatDate(new Date())}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>العملية</th>
              <th>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>مجموع المشتريات:</span>
            <span>${formatCurrency(totalPurchases)}</span>
          </div>
          <div class="summary-row">
            <span>مجموع المسدد:</span>
            <span>${formatCurrency(totalPayments)}</span>
          </div>
          <div class="summary-row" style="font-weight: bold; font-size: ${baseFontSize + 2}px;">
            <span>الرصيد الحالي (دين):</span>
            <span>${formatCurrency(currentDebt)}</span>
          </div>
        </div>

        <div class="footer">
          <p>${settings.reportFooterText || 'شكرا لتعاملكم معنا'}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '', 'height=600,width=400');
  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
};
</script>
