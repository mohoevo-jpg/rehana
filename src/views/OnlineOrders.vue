<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Globe class="w-8 h-8 text-primary-600" />
        الطلبات الواردة ({{ newOrdersCount }})
      </h2>
      
      <div class="flex gap-2">
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          {{ isConnected ? 'متصل بالخادم' : 'غير متصل' }}
        </span>
        <button @click="ordersStore.fetchOrders()" class="p-2 hover:bg-gray-100 rounded-full">
          <RefreshCw class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Orders List -->
    <div class="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <div v-if="orders.length === 0" class="flex-1 flex flex-col items-center justify-center text-gray-400">
        <Inbox class="w-16 h-16 mb-4 opacity-50" />
        <p>لا توجد طلبات جديدة</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto">
        <div class="divide-y divide-gray-200">
          <div 
            v-for="order in orders" 
            :key="order.id"
            class="p-4 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-primary-50': order.status === 'pending' }"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-lg">#{{ order.id.slice(-6) }}</span>
                  <span 
                    class="px-2 py-0.5 text-xs rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': order.status === 'pending',
                      'bg-blue-100 text-blue-800': order.status === 'accepted',
                      'bg-red-100 text-red-800': order.status === 'rejected',
                      'bg-green-100 text-green-800': order.status === 'completed',
                    }"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ formatDate(order.date) }} • {{ order.customerName }} ({{ order.customerPhone }})
                </div>
              </div>
              <div class="text-left">
                <div class="font-bold text-lg text-primary-600">{{ formatCurrency(order.total) }}</div>
                <div class="text-xs text-gray-500">{{ order.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'دفع إلكتروني' }}</div>
              </div>
            </div>

            <!-- Items -->
            <div class="bg-gray-50 rounded p-3 mb-3 text-sm">
              <div v-for="(item, idx) in order.items" :key="idx" class="flex justify-between py-1 border-b border-gray-200 last:border-0">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>{{ formatCurrency(item.price * item.quantity) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2" v-if="order.status === 'pending'">
              <button 
                @click="updateStatus(order.id, 'rejected')"
                class="px-4 py-2 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-sm font-medium"
              >
                رفض الطلب
              </button>
              <button 
                @click="updateStatus(order.id, 'accepted')"
                class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm font-medium"
              >
                قبول وتجهيز
              </button>
            </div>
            
            <div class="flex justify-end gap-2" v-if="order.status === 'accepted'">
               <button 
                @click="updateStatus(order.id, 'completed')"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
              >
                إكمال وتسليم
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useOnlineOrdersStore } from '../store/onlineOrders';
import { Globe, Inbox, RefreshCw } from 'lucide-vue-next';
import { formatCurrency } from '../utils/currency';

const ordersStore = useOnlineOrdersStore();

const orders = computed(() => ordersStore.orders);
const isConnected = computed(() => ordersStore.isConnected);
const newOrdersCount = computed(() => ordersStore.newOrdersCount);

onMounted(() => {
  ordersStore.initSocket();
  ordersStore.markAsRead();
});

const updateStatus = (id, status) => {
  ordersStore.updateOrderStatus(id, status);
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'قيد الانتظار',
    accepted: 'قيد التجهيز',
    rejected: 'مرفوض',
    completed: 'مكتمل'
  };
  return labels[status] || status;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('ar-IQ');
};
</script>