// Simple wrapper to be used in non-component files if needed
export const showToast = (message, type = 'success') => {
  console.log(`[TOAST ${type.toUpperCase()}]: ${message}`);
  // In a real app, this would emit an event to the global toast component
};
