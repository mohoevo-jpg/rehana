<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="close"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Modal Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b flex justify-between items-center no-print">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            {{ title || 'معاينة التقرير' }}
          </h3>
          <div class="flex gap-2">
            <button v-if="allowReceipt" @click="$emit('print-receipt')" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm">
              طباعة وصل
            </button>
            <button @click="print" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:text-sm">
              طباعة
            </button>
            <button @click="close" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm">
              إغلاق
            </button>
          </div>
        </div>

        <!-- A4 Paper Preview Container -->
        <div class="bg-gray-100 p-8 overflow-y-auto max-h-[80vh] flex justify-center no-print-bg">
          <div id="print-area" class="bg-white shadow-lg mx-auto" :style="pageStyle">
            <!-- Header -->
            <div class="flex justify-between items-start border-b-2 pb-6 mb-6" :style="{ borderColor: settings.reportPrimaryColor }">
              <div class="flex-1">
                <h1 class="text-3xl font-bold mb-2" :style="{ color: settings.reportPrimaryColor }">{{ settings.reportHeaderTitle }}</h1>
                <p class="text-gray-500 text-sm font-bold">{{ settings.shopName }}</p>
                <div class="mt-2 text-xs text-gray-500 space-y-1">
                  <p>رقم التقرير: #{{ Math.floor(Math.random() * 100000) }}</p>
                  <p>تاريخ الإصدار: {{ new Date().toLocaleDateString('ar-IQ') }}</p>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <div v-if="settings.reportShowLogo" class="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                   <!-- Logo: Use settings.logo if set, otherwise default to /logo.png -->
                   <img :src="settings.logo || '/logo.png'" class="w-full h-full object-contain" @error="$event.target.style.display='none'" />
                </div>
              </div>
            </div>

            <!-- Content Title -->
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 border-r-4 px-4 py-1" :style="{ borderColor: settings.reportPrimaryColor }">
                {{ reportTitle }}
              </h2>
              <p class="text-gray-500 mt-1 px-5" v-if="subtitle">{{ subtitle }}</p>
            </div>

            <!-- Table -->
            <div class="w-full mb-8">
              <table class="w-full border-collapse">
                <thead>
                  <tr :style="{ backgroundColor: settings.reportPrimaryColor + '10' }">
                    <th v-for="col in columns" :key="col.key" 
                        class="p-3 text-right font-bold border-b-2"
                        :style="{ 
                          color: settings.reportPrimaryColor,
                          borderColor: settings.reportPrimaryColor,
                          fontSize: settings.reportFontSize + 'px'
                        }">
                      {{ col.label }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in data" :key="index" class="border-b" 
                      :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                      :style="{ borderColor: settings.reportBorderColor }">
                    <td v-for="col in columns" :key="col.key" 
                        class="p-3 text-gray-700"
                        :style="{ fontSize: settings.reportFontSize + 'px' }">
                      <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                        {{ row[col.key] }}
                      </slot>
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="summary">
                  <tr class="bg-gray-50 font-bold">
                    <td v-for="col in columns" :key="'foot-'+col.key" class="p-3 border-t-2 border-gray-300">
                      {{ summary[col.key] || '' }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Footer -->
            <div class="mt-auto">
              <!-- Signatures -->
              <div class="grid grid-cols-2 gap-8 mb-8">
                <div class="text-center">
                  <p class="text-sm font-bold mb-16">توقيع المستلم</p>
                  <div class="border-b-2 w-2/3 mx-auto border-gray-300"></div>
                </div>
                <div class="text-center">
                  <p class="text-sm font-bold mb-16">ختم وتوقيع الإدارة</p>
                  <div class="border-b-2 w-2/3 mx-auto border-gray-300"></div>
                </div>
              </div>

              <!-- Contact Info & Social Media -->
              <div class="border-t-2 pt-4" :style="{ borderColor: settings.reportPrimaryColor }">
                <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div class="space-y-1">
                    <p class="flex items-center gap-2">
                      <span class="font-bold">العنوان:</span> {{ settings.address }}
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="font-bold">الهاتف:</span> {{ settings.phone }}
                    </p>
                    <p v-if="settings.email" class="flex items-center gap-2">
                      <span class="font-bold">البريد الإلكتروني:</span> {{ settings.email }}
                    </p>
                  </div>
                  <div class="space-y-1 text-left" dir="ltr">
                    <p v-if="settings.facebookUrl" class="flex items-center gap-2 justify-end">
                      {{ settings.facebookUrl }} <span class="font-bold">:Facebook</span>
                    </p>
                    <p v-if="settings.instagramUrl" class="flex items-center gap-2 justify-end">
                      {{ settings.instagramUrl }} <span class="font-bold">:Instagram</span>
                    </p>
                    <p v-if="settings.telegramUrl" class="flex items-center gap-2 justify-end">
                      {{ settings.telegramUrl }} <span class="font-bold">:Telegram</span>
                    </p>
                    <p v-if="settings.websiteUrl" class="flex items-center gap-2 justify-end">
                      {{ settings.websiteUrl }} <span class="font-bold">:Web</span>
                    </p>
                  </div>
                </div>
                
                <div class="text-center text-xs text-gray-400 mt-2">
                  <p>{{ settings.reportFooterText }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSettingsStore } from '../../store/settings';

const props = defineProps({
  show: Boolean,
  title: String,
  reportTitle: String,
  subtitle: String,
  columns: Array,
  data: Array,
  summary: Object,
  allowReceipt: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'print-receipt']);
const settingsStore = useSettingsStore();
const settings = computed(() => settingsStore.$state);

const close = () => emit('close');

const pageStyle = computed(() => ({
  width: '210mm',
  minHeight: '297mm',
  padding: '20mm',
  position: 'relative',
  boxSizing: 'border-box'
}));

const print = () => {
  const printWindow = window.open('', '', 'height=600,width=800');
  
  // Get the logo URL (handle both relative and absolute paths)
  // We use window.location.origin to ensure the logo path is absolute for the print window
  const logoSrc = settings.logo || '/logo.png';
  const logoUrl = logoSrc.startsWith('http') ? logoSrc : `${window.location.origin}${logoSrc.startsWith('/') ? '' : '/'}${logoSrc}`;

  printWindow.document.write('<html><head><title>طباعة التقرير</title>');
  // Add Tailwind via CDN for styling in print window or inline styles
  printWindow.document.write('<script src="https://cdn.tailwindcss.com"><\/script>');
  printWindow.document.write('<style>');
  printWindow.document.write(`
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
    body { font-family: 'Tajawal', sans-serif; direction: rtl; }
    @page { size: A4; margin: 0; }
    @media print { 
      body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    .page-container { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; background: white; }
  `);
  printWindow.document.write('</style>');
  printWindow.document.write('</head><body>');
  
  // Preload the logo image before showing content to ensure it prints
  printWindow.document.write(`<img src="${logoUrl}" style="display:none;" onload="this.remove()">`);

  printWindow.document.write('<div class="page-container">');
  
  // Replace relative image paths in content with absolute paths
  let content = printContent;
  if (content.includes('src="/')) {
    content = content.replace(/src="\//g, `src="${window.location.origin}/`);
  }
  
  printWindow.document.write(content);
  printWindow.document.write('</div>');
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  printWindow.onload = () => {
    // Wait a bit for Tailwind and Images to load
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 1500); // Increased timeout to ensure image loads
  };
};
</script>

<style scoped>
.no-print-bg {
  @media print {
    display: none;
  }
}
</style>