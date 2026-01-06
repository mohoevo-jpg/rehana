import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    discount: 0,
    customer: null,
  }),
  getters: {
    subtotal: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    total: (state) => {
      const sub = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return Math.max(0, sub - state.discount);
    },
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    addToCart(product) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(productId) {
      const index = this.items.findIndex(i => i.id === productId);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(i => i.id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
        }
      }
    },
    clearCart() {
      this.items = [];
      this.discount = 0;
      this.customer = null;
    },
    setDiscount(amount) {
      this.discount = amount;
    },
    setCustomer(customer) {
      this.customer = customer;
    }
  }
});
