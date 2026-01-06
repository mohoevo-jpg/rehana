<template>
  <div class="barcode-preview-container flex flex-col items-center justify-center p-4 rounded bg-white border border-gray-300 w-full min-h-[200px]">
    <div v-if="loading" class="text-gray-400 animate-pulse mb-4">
      جاري تحميل الباركود...
    </div>
    
    <svg ref="barcodeRef" class="max-w-full transition-opacity duration-300" :class="{ 'opacity-100': !loading && !error, 'opacity-0': loading || error }"></svg>
    
    <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 rounded text-sm w-full text-center border border-red-200">
      <p class="font-bold mb-1">عذراً، حدث خطأ:</p>
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import JsBarcode from 'jsbarcode';

const props = defineProps({
  settings: {
    type: Object,
    required: true,
    default: () => ({})
  },
  value: {
    type: String,
    default: '1234567890'
  }
});

const barcodeRef = ref(null);
const error = ref('');
const loading = ref(true);

const renderBarcode = async () => {
  loading.value = true;
  error.value = '';
  await nextTick();
  
  if (!barcodeRef.value) {
    // Component might be unmounted or hidden
    return;
  }

  try {
    // Default values to prevent errors
    const format = (props.settings.barcodeFormat || 'CODE128').trim() || 'CODE128';
    const width = Math.max(1, Number(props.settings.barcodeWidth) || 2);
    const height = Math.max(30, Number(props.settings.barcodeHeight) || 100);
    const fontSize = Math.max(10, Number(props.settings.barcodeFontSize) || 20);
    const margin = Number(props.settings.barcodeMargin) >= 0 ? Number(props.settings.barcodeMargin) : 10;
    const displayValue = props.settings.barcodeShowText !== false;

    // Reset SVG content is handled by JsBarcode usually, but we can clear if needed
    barcodeRef.value.innerHTML = '';

    JsBarcode(barcodeRef.value, props.value || '1234567890', {
      format: format,
      lineColor: "#000000",
      width: width,
      height: height,
      displayValue: displayValue,
      fontSize: fontSize,
      textMargin: 2,
      margin: margin,
      background: '#ffffff',
      valid: (valid) => {
        if (!valid) {
          error.value = 'تنسيق الباركود غير صالح للبيانات المدخلة';
        }
        loading.value = false;
      }
    });
    
    // If no error triggered synchronously
    if (!error.value) {
        loading.value = false;
    }

  } catch (e) {
    console.error("Barcode render error:", e);
    error.value = 'فشل في إنشاء الباركود: ' + (e.message || 'خطأ غير معروف');
    loading.value = false;
  }
};

onMounted(() => {
  renderBarcode();
  // Double check render after a short delay to ensure DOM layout
  setTimeout(renderBarcode, 200);
});

watch(
  () => props.settings,
  () => {
    renderBarcode();
  },
  { deep: true }
);

watch(
  () => props.value,
  () => {
      renderBarcode();
  }
);
</script>
