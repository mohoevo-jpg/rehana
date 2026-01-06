<template>
  <div class="h-full flex flex-col lg:flex-row gap-4 overflow-hidden">
    <!-- Products Section (Right side in RTL) -->
    <div class="flex-1 h-1/2 lg:h-full overflow-hidden">
      <ProductGrid 
        :products="productsStore.getAllProducts"
        @add-to-cart="handleAddToCart"
      />
    </div>

    <!-- Cart Section (Left side in RTL) -->
    <div class="w-full lg:w-96 h-1/2 lg:h-full overflow-hidden">
      <CartList 
        @checkout="showPayment = true"
        @print="handlePrintCart"
      />
    </div>

    <!-- Payment Modal -->
    <Transition name="modal">
      <div v-if="showPayment" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <PaymentBox 
          :total="cartStore.total"
          :has-customer="!!cartStore.customer"
          @close="showPayment = false"
          @confirm="handlePayment"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductGrid from '../components/cashier/ProductGrid.vue';
import CartList from '../components/cashier/CartList.vue';
import PaymentBox from '../components/cashier/PaymentBox.vue';
import { useProductsStore } from '../store/products';
import { useCartStore } from '../store/cart';
import { useSalesStore } from '../store/sales';
import { useSettingsStore } from '../store/settings';
import { useAuthStore } from '../store/auth';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

const productsStore = useProductsStore();
const cartStore = useCartStore();
const salesStore = useSalesStore();
const settingsStore = useSettingsStore();
const authStore = useAuthStore();

const showPayment = ref(false);

onMounted(() => {
  productsStore.fetchProducts();
});

const handleAddToCart = (product) => {
  cartStore.addToCart(product);
};

const handlePrintCart = () => {
  const currentUser = authStore.currentUser;
  const saleData = {
    id: 'TEMP-' + Date.now(),
    items: [...cartStore.items],
    subtotal: cartStore.subtotal,
    discount: cartStore.discount,
    total: cartStore.total,
    payment: { method: 'N/A' }, // Not paid yet
    date: new Date(),
    userId: currentUser?.id,
    branchId: currentUser?.branchId,
    customerId: cartStore.customer?.id,
    customerName: cartStore.customer?.name
  };
  printInvoice(saleData, true); // true for proforma/quote
};

const handlePayment = (paymentDetails) => {
  const currentUser = authStore.currentUser;
  const saleData = {
    id: Date.now(), // Simple ID generation
    items: [...cartStore.items],
    subtotal: cartStore.subtotal,
    discount: cartStore.discount,
    total: cartStore.total,
    payment: paymentDetails,
    date: new Date(),
    userId: currentUser?.id,
    branchId: currentUser?.branchId,
    customerId: cartStore.customer?.id,
    customerName: cartStore.customer?.name
  };

  // Record Sale
  salesStore.addSale(saleData);

  // Print Invoice
  if (paymentDetails.shouldPrint) {
    printInvoice(saleData);
  }

  // Clear Cart
  cartStore.clearCart();
  showPayment.value = false;
  
  // Show success feedback (mock toast)
  // alert('تم الدفع بنجاح'); // Optional, since print dialog will appear
};

const printInvoice = (sale, isQuote = false) => {
  const settings = settingsStore;
  const title = isQuote ? 'عرض سعر' : `فاتورة #${sale.id}`;
  const paperWidth = settings.invoicePaperSize || '80mm';
  const fontSize = (settings.invoiceFontSize || 12) + 'px';
  const baseFontSize = (settings.invoiceFontSize || 12);
  
  const itemsHtml = sale.items.map(item => `
    <tr>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">${formatCurrency(item.price)}</td>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const paymentMethodLabel = {
    'cash': 'نقدي',
    'card': 'ماستر كارد',
    'credit': 'آجل (دين)'
  }[sale.payment.method] || sale.payment.method;

  const socialMediaHtml = settings.showSocialMediaOnInvoice ? `
    <div style="margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px;">
       ${settings.facebookUrl ? `<div>${settings.facebookUrl} :Fb</div>` : ''}
       ${settings.instagramUrl ? `<div>${settings.instagramUrl} :Insta</div>` : ''}
       ${settings.telegramUrl ? `<div>${settings.telegramUrl} :Tele</div>` : ''}
       ${settings.websiteUrl ? `<div>${settings.websiteUrl} :Web</div>` : ''}
       ${settings.email ? `<div>${settings.email}</div>` : ''}
    </div>
  ` : '';

  const logoHtml = settings.showLogoOnInvoice 
    ? (settings.invoiceLogoUrl 
        ? `<img src="${settings.invoiceLogoUrl}" style="max-width: 80%; max-height: 100px; display: block; margin: 0 auto 10px auto;">` 
        : '<div style="margin-bottom:10px; font-weight:bold; border:2px solid black; padding:5px; display:inline-block;">LOGO</div>')
    : '';

  const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; padding: 10px; width: ${paperWidth}; margin: 0 auto; font-size: ${fontSize}; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h2 { margin: 0; font-size: ${baseFontSize + 4}px; }
          .meta { margin-bottom: 15px; font-size: ${fontSize}; }
          table { width: 100%; border-collapse: collapse; font-size: ${fontSize}; }
          th { text-align: right; border-bottom: 2px solid #000; padding: 5px; }
          .totals { margin-top: 20px; border-top: 2px solid #000; padding-top: 10px; }
          .totals div { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .footer { margin-top: 30px; text-align: center; font-size: ${fontSize}; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoHtml}
          <h2>${settings.shopName}</h2>
          <p style="margin: 5px 0; color: #666;">${settings.address}</p>
          <p style="margin: 5px 0; color: #666;">${settings.phone}</p>
          ${settings.invoiceHeader ? `<p style="margin-top:5px; font-weight:bold;">${settings.invoiceHeader}</p>` : ''}
          <h3 style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px; font-size: ${baseFontSize + 2}px;">${title}</h3>
        </div>
        
        <div class="meta">
          <div>${isQuote ? 'رقم العرض' : 'رقم الفاتورة'}: #${sale.id}</div>
          ${settings.showDate !== false ? `<div>التاريخ: ${formatDate(sale.date)}</div>` : ''}
          ${!isQuote && sale.payment ? `<div>طريقة الدفع: ${paymentMethodLabel}</div>` : ''}
          ${settings.showCustomerInfo && sale.customerName ? `<div>العميل: ${sale.customerName}</div>` : ''}
          ${settings.showCashierName ? `<div>الكاشير: محمد</div>` : ''}
          ${sale.payment.method === 'credit' ? '<div style="font-weight: bold; color: red;">* فاتورة آجلة (دين)</div>' : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>المجموع</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          ${sale.discount > 0 ? `
            <div>
              <span>المجموع الفرعي:</span>
              <span>${formatCurrency(sale.subtotal || sale.total + sale.discount)}</span>
            </div>
            <div>
              <span>الخصم:</span>
              <span>${formatCurrency(sale.discount)}</span>
            </div>
          ` : ''}
          <div style="font-weight: bold; font-size: ${baseFontSize + 2}px;">
            <span>المجموع الكلي:</span>
            <span>${formatCurrency(sale.total)}</span>
          </div>
        </div>

        <div class="footer">
          ${socialMediaHtml}
          <p>${settings.invoiceFooter || ''}</p>
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
