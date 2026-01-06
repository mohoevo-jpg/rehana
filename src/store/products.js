import { defineStore } from 'pinia';
import api from '../services/api';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),
  getters: {
    getAllProducts: (state) => state.products,
    getProductById: (state) => (id) => state.products.find(p => p.id === id),
    getProductByBarcode: (state) => (barcode) => state.products.find(p => p.barcode === barcode),
  },
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await api.get('/products');
        // Map backend structure to frontend structure if needed
        this.setProducts(response.data);
        // Cache products for offline use
        localStorage.setItem('cached_products', JSON.stringify(response.data));
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback to cached products if available
        const cached = localStorage.getItem('cached_products');
        if (cached) {
          this.setProducts(JSON.parse(cached));
          // Don't set error if we successfully loaded from cache, just warn
          console.warn('Loaded products from cache (offline mode)');
        } else {
          this.error = err.message;
        }
      } finally {
        this.loading = false;
      }
    },
    async addProduct(product) {
      this.loading = true;
      try {
        // Map frontend structure to backend structure
        const payload = {
          ...product,
          quantity: product.stock,
          images: product.image ? [product.image] : [],
          isAvailable: true // Default
        };
        const response = await api.post('/products', payload);
        // The socket event will update the list, but we can also update locally for immediate feedback
        // if we trust the response. However, relying on socket/refetch is safer for sync.
        // But for responsiveness, let's update if successful.
        // Actually, server returns { success: true, product }
        const newProduct = response.data.product;
        // Check if it already exists (update case handled by same API)
        this.updateLocalProduct(newProduct);
        
      } catch (err) {
        this.error = err.message;
        console.error('Error adding product:', err);
      } finally {
        this.loading = false;
      }
    },
    async updateProduct(product) {
      // Same as addProduct because backend uses upsert
      await this.addProduct(product);
    },
    async deleteProduct(id) {
      this.loading = true;
      try {
        await api.delete(`/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
      } catch (err) {
        this.error = err.message;
        console.error('Error deleting product:', err);
      } finally {
        this.loading = false;
      }
    },
    setProducts(products) {
      this.products = products.map(p => ({
        ...p,
        stock: p.quantity,
        image: p.images && p.images.length > 0 ? p.images[0] : ''
      }));
    },
    updateLocalProduct(backendProduct) {
       const mapped = {
          ...backendProduct,
          stock: backendProduct.quantity,
          image: backendProduct.images && backendProduct.images.length > 0 ? backendProduct.images[0] : ''
       };
       
       const index = this.products.findIndex(p => p.id === mapped.id);
       if (index !== -1) {
         this.products[index] = mapped;
       } else {
         this.products.push(mapped);
       }
    }
  }
});
