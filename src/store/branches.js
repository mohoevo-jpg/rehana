import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useBranchesStore = defineStore('branches', {
  state: () => ({
    branches: JSON.parse(localStorage.getItem('branches')) || [
      { id: '1', name: 'الفرع الرئيسي', location: 'الموصل - حي الزهور', phone: '07700000000' }
    ]
  }),
  
  getters: {
    getAllBranches: (state) => state.branches,
    getBranchById: (state) => (id) => state.branches.find(b => b.id === id)
  },
  
  actions: {
    addBranch(branch) {
      const newBranch = { ...branch, id: uuidv4() };
      this.branches.push(newBranch);
      this.saveToLocalStorage();
    },
    
    updateBranch(updatedBranch) {
      const index = this.branches.findIndex(b => b.id === updatedBranch.id);
      if (index !== -1) {
        this.branches[index] = updatedBranch;
        this.saveToLocalStorage();
      }
    },
    
    deleteBranch(id) {
      this.branches = this.branches.filter(b => b.id !== id);
      this.saveToLocalStorage();
    },
    
    saveToLocalStorage() {
      localStorage.setItem('branches', JSON.stringify(this.branches));
    }
  }
});
