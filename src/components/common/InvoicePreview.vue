<template>
  <div class="invoice-preview bg-white text-black p-4 mx-auto shadow-lg box-border" 
       :style="{ 
         width: settings.invoicePaperSize || '80mm', 
         minHeight: '100mm', 
         fontFamily: 'Arial, sans-serif', 
         direction: 'rtl', 
         color: '#000000', 
         backgroundColor: '#ffffff',
         fontSize: (settings.invoiceFontSize || 12) + 'px'
       }">
    <div class="text-center mb-4">
       <div v-if="settings.showLogoOnInvoice" class="mb-2 flex justify-center">
         <img v-if="settings.invoiceLogoUrl" :src="settings.invoiceLogoUrl" class="max-w-[80%] max-h-[100px] object-contain mx-auto">
         <div v-else class="font-bold border-2 border-black inline-block p-1 px-3" style="border-color: #000000;">LOGO</div>
       </div>
       <h2 class="m-0 font-bold mb-1" :style="{ fontSize: ((settings.invoiceFontSize || 12) + 4) + 'px' }">{{ settings.shopName || 'اسم المتجر' }}</h2>
       <p class="text-gray-600 mb-1" style="color: #4b5563;">{{ settings.address || 'العنوان' }}</p>
       <p class="text-gray-600" style="color: #4b5563;">{{ settings.phone || '07700000000' }}</p>
       <p v-if="settings.invoiceHeader" class="font-medium mt-1">{{ settings.invoiceHeader }}</p>
       <h3 class="mt-2 border-t border-dashed border-black pt-2 font-bold" :style="{ fontSize: ((settings.invoiceFontSize || 12) + 2) + 'px', borderColor: '#000000' }">فاتورة #12345</h3>
    </div>

    <div class="mb-3 space-y-1">
      <div class="flex justify-between">
        <span>رقم الفاتورة: #12345</span>
      </div>
      <div class="flex justify-between" v-if="settings.showDate !== false">
        <span>التاريخ: {{ new Date().toLocaleDateString('ar-IQ') }}</span>
      </div>
      <div class="flex justify-between" v-if="settings.showCashierName">
        <span>الكاشير: محمد</span>
      </div>
      <div class="flex justify-between" v-if="settings.showCustomerInfo">
        <span>العميل: عميل نقدي</span>
      </div>
    </div>

    <table class="w-full border-collapse mb-4">
      <thead>
        <tr>
          <th class="text-right border-b-2 border-black py-1" style="border-color: #000000;">المنتج</th>
          <th class="text-center border-b-2 border-black py-1" style="border-color: #000000;">الكمية</th>
          <th class="text-left border-b-2 border-black py-1" style="border-color: #000000;">السعر</th>
          <th class="text-left border-b-2 border-black py-1" style="border-color: #000000;">المجموع</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in previewItems" :key="item.id">
           <td class="py-1 border-b border-gray-200">{{ item.name }}</td>
           <td class="text-center py-1 border-b border-gray-200">{{ item.quantity }}</td>
           <td class="text-left py-1 border-b border-gray-200">{{ item.price }}</td>
           <td class="text-left py-1 border-b border-gray-200">{{ item.total }}</td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4 border-t-2 border-black pt-2" style="border-color: #000000;">
       <div class="flex justify-between mb-1">
         <span>المجموع:</span>
         <span>60,000</span>
       </div>
       <div class="flex justify-between mb-1 text-gray-600" style="color: #4b5563;">
         <span>الخصم:</span>
         <span>0</span>
       </div>
       <div class="flex justify-between font-bold mt-2 border-t border-dashed border-black pt-2" :style="{ fontSize: ((settings.invoiceFontSize || 12) + 4) + 'px', borderColor: '#000000' }">
         <span>الاجمالي:</span>
         <span>60,000 د.ع</span>
       </div>
    </div>

    <div class="mt-6 text-center">
        <div v-if="settings.showSocialMediaOnInvoice" class="mb-3 border-b border-dashed border-black pb-2 space-y-1" style="border-color: #000000;">
             <div v-if="settings.facebookUrl" dir="ltr" class="flex justify-center gap-1 items-center">
               <span>{{ settings.facebookUrl }}</span> <span class="font-bold">:Fb</span>
             </div>
             <div v-if="settings.instagramUrl" dir="ltr" class="flex justify-center gap-1 items-center">
               <span>{{ settings.instagramUrl }}</span> <span class="font-bold">:Insta</span>
             </div>
             <div v-if="settings.telegramUrl" dir="ltr" class="flex justify-center gap-1 items-center">
               <span>{{ settings.telegramUrl }}</span> <span class="font-bold">:Tele</span>
             </div>
             <div v-if="settings.websiteUrl" dir="ltr" class="flex justify-center gap-1 items-center">
               <span>{{ settings.websiteUrl }}</span> <span class="font-bold">:Web</span>
             </div>
             <div v-if="settings.email">{{ settings.email }}</div>
        </div>

        <p v-if="settings.invoiceFooter" class="text-gray-600" style="color: #4b5563;">{{ settings.invoiceFooter }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  width: {
    type: String,
    default: '80mm'
  }
});

const previewItems = [
  { id: 1, name: 'منتج 1', quantity: 2, price: '10,000', total: '20,000' },
  { id: 2, name: 'منتج 2', quantity: 1, price: '25,000', total: '25,000' },
  { id: 3, name: 'منتج 3', quantity: 3, price: '5,000', total: '15,000' },
];
</script>

<style scoped>
/* Optional specific styles for print preview if needed */
</style>
