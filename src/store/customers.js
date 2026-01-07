import { defineStore } from 'pinia';

// Mock Data
const MOCK_CUSTOMERS = [
  { id: 1, name: 'أحمد محمد', phone: '07701234567', email: 'ahmed@example.com', address: 'الموصل - حي الزهور', notes: 'عميل مميز', registrationDate: '2023-01-15' },
  { id: 2, name: 'سارة علي', phone: '07809876543', email: 'sara@example.com', address: 'الموصل - المثنى', notes: '', registrationDate: '2023-03-20' },
  { id: 3, name: 'شركة النور', phone: '07505555555', email: 'info@alnoor.com', address: 'الموصل - المجموعة الثقافية', notes: 'شركة توريد', registrationDate: '2023-06-10' },
];

export const useCustomersStore = defineStore('customers', {
  state: () => ({
    customers: JSON.parse(localStorage.getItem('customers')) || MOCK_CUSTOMERS,
    loading: false,
    error: null,
  }),
  getters: {
    getAllCustomers: (state) => state.customers,
    getCustomerById: (state) => (id) => state.customers.find(c => c.id === id),
  },
  actions: {
    addCustomer(customer) {
      const newCustomer = {
        ...customer,
        id: Date.now(),
        registrationDate: new Date().toISOString()
      };
      this.customers.push(newCustomer);
      this.persist();
    },
    updateCustomer(customer) {
      const index = this.customers.findIndex(c => c.id === customer.id);
      if (index !== -1) {
        this.customers[index] = customer;
        this.persist();
      }
    },
    deleteCustomer(id) {
      this.customers = this.customers.filter(c => c.id !== id);
      this.persist();
    },
    persist() {
      localStorage.setItem('customers', JSON.stringify(this.customers));
    }
  }
});
