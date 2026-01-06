import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useUsersStore = defineStore('users', {
  state: () => {
    let users = JSON.parse(localStorage.getItem('users'));
    const defaultUsers = [
      { 
        id: '1', 
        name: 'مدير النظام', 
        role: 'admin', 
        branchId: '1', 
        username: 'admin',
        password: '123', // In a real app, this should be hashed
        permissions: ['all'] 
      },
      { 
        id: '2', 
        name: 'كاشير 1', 
        role: 'cashier', 
        branchId: '1', 
        username: 'cashier1',
        password: '123',
        permissions: ['cashier', 'products', 'sales', 'chat', 'complaints', 'settings'] 
      }
    ];

    if (!users) {
      users = defaultUsers;
    } else {
      // Auto-migration: Ensure cashier1 has complaints and settings permissions
      const cashier = users.find(u => u.username === 'cashier1');
      if (cashier) {
        ['complaints', 'settings'].forEach(p => {
          if (!cashier.permissions.includes(p)) {
            cashier.permissions.push(p);
          }
        });
        // Force update permissions to ensure consistency
        const defaultCashier = defaultUsers.find(u => u.username === 'cashier1');
        if (defaultCashier) {
           // Ensure basic permissions are present
           defaultCashier.permissions.forEach(p => {
             if (!cashier.permissions.includes(p)) {
               cashier.permissions.push(p);
             }
           });
        }
        localStorage.setItem('users', JSON.stringify(users));
      }
    }

    return {
      users,
      currentUser: null
    };
  },
  
  getters: {
    getAllUsers: (state) => state.users,
    getUsersByBranch: (state) => (branchId) => state.users.filter(u => u.branchId === branchId),
    getUserById: (state) => (id) => state.users.find(u => u.id === id),
    verifyCredentials: (state) => (username, password) => {
      return state.users.find(u => u.username === username && u.password === password);
    }
  },
  
  actions: {
    addUser(user) {
      const newUser = { ...user, id: uuidv4() };
      this.users.push(newUser);
      this.saveToLocalStorage();
    },
    
    updateUser(updatedUser) {
      const index = this.users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        // Preserve password if not provided in update
        if (!updatedUser.password) {
          updatedUser.password = this.users[index].password;
        }
        this.users[index] = updatedUser;
        this.saveToLocalStorage();
      }
    },
    
    changePassword(userId, newPassword) {
      const index = this.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.users[index].password = newPassword;
        this.saveToLocalStorage();
      }
    },
    
    deleteUser(id) {
      this.users = this.users.filter(u => u.id !== id);
      this.saveToLocalStorage();
    },
    
    login(username, password) {
      // Simple mock login
      const user = this.users.find(u => u.username === username);
      if (user) {
        this.currentUser = user;
        return true;
      }
      return false;
    },
    
    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }
});
