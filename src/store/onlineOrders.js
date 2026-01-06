import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { useProductsStore } from './products';
import api from '../services/api';

// Use relative path for socket.io to leverage Vite proxy
const isElectron = window.navigator.userAgent.toLowerCase().includes('electron');
const SERVER_URL = isElectron ? 'http://localhost:3001' : '';

export const useOnlineOrdersStore = defineStore('onlineOrders', {
  state: () => ({
    socket: null,
    orders: [],
    isConnected: false,
    newOrdersCount: 0
  }),
  
  actions: {
    initSocket() {
      if (this.socket) return;
      
      this.socket = io(SERVER_URL, {
        transports: ['websocket', 'polling']
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to Online Orders Server');
        this.isConnected = true;
        this.socket.emit('register-cashier');
        this.syncProducts(); // Sync products on connect
      });
      
      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Disconnected from server');
      });
      
      this.socket.on('new-order', (order) => {
        this.orders.unshift(order);
        this.newOrdersCount++;
        // Play notification sound if needed
        const audio = new Audio('/notification.mp3'); // Need to add this file or ignore for now
        audio.play().catch(e => console.log('Audio play failed', e));
      });

      this.socket.on('products-updated', (products) => {
        const productsStore = useProductsStore();
        productsStore.setProducts(products);
      });

      // Initial fetch
      this.fetchOrders();
    },
    
    async fetchOrders() {
      try {
        const response = await api.get('/orders');
        this.orders = response.data;
      } catch (e) {
        console.error('Failed to fetch orders', e);
      }
    },
    
    async updateOrderStatus(orderId, status) {
      try {
        const response = await api.put(`/orders/${orderId}/status`, { status });
        
        if (response.data.success) {
          const order = this.orders.find(o => o.id === orderId);
          if (order) order.status = status;
        }
      } catch (e) {
        console.error('Failed to update status', e);
      }
    },
    
    markAsRead() {
      this.newOrdersCount = 0;
    },

    async syncProducts() {
      const productsStore = useProductsStore();
      await productsStore.fetchProducts();
    }
  }
});