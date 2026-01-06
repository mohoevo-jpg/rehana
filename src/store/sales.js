import { defineStore } from 'pinia';
import api from '../services/api';

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: [],
    loading: false,
    error: null,
    offlineQueue: JSON.parse(localStorage.getItem('offline_sales') || '[]'),
  }),
  getters: {
    todaySales: (state) => {
      const today = new Date().toDateString();
      return state.sales.filter(s => new Date(s.date).toDateString() === today);
    },
    totalRevenue: (state) => state.sales.reduce((sum, s) => sum + s.total, 0),
    pendingSyncCount: (state) => state.offlineQueue.length,
  },
  actions: {
    async addSale(sale) {
      this.loading = true;
      
      const payload = {
        items: sale.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price, // Use effective price
            name: item.name
        })),
        total: sale.total,
        paymentMethod: sale.payment?.method || 'cash',
        customerId: sale.customerId,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        createdAt: sale.date || new Date() // Preserve creation time
      };

      try {
        const response = await api.post('/orders', payload);
        
        this.sales.unshift({
          ...sale,
          id: response.data.order.id,
          date: new Date(),
        });
      } catch (err) {
        console.error('Error adding sale (switching to offline):', err);
        
        // Save locally
        const offlineOrder = {
            ...payload,
            frontendId: sale.id || Date.now(),
            offline: true
        };
        
        this.offlineQueue.push(offlineOrder);
        localStorage.setItem('offline_sales', JSON.stringify(this.offlineQueue));
        
        this.sales.unshift({
          ...sale,
          id: offlineOrder.frontendId.toString(),
          date: new Date(),
          offline: true
        });
        
        this.error = 'Connection lost. Order saved locally.';
      } finally {
        this.loading = false;
      }
    },
    
    async syncOfflineSales() {
        if (this.offlineQueue.length === 0) return;
        
        console.log('Syncing offline sales...', this.offlineQueue.length);
        const queue = [...this.offlineQueue];
        const failed = [];
        
        for (const order of queue) {
            try {
                await api.post('/orders', order);
            } catch (err) {
                console.error('Failed to sync order:', order, err);
                failed.push(order);
            }
        }
        
        this.offlineQueue = failed;
        localStorage.setItem('offline_sales', JSON.stringify(this.offlineQueue));
        
        if (failed.length === 0) {
            console.log('All offline sales synced successfully');
        } else {
            console.warn(`Failed to sync ${failed.length} orders`);
        }
    }
  }
});
