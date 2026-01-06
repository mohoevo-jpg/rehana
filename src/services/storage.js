// Storage Service Wrapper
export const storage = {
  get(key) {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  },
  set(key, value) {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};
