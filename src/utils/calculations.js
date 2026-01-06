export const calculateTotal = (items, discount = 0, taxRate = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  return Math.max(0, subtotal + tax - discount);
};

export const calculateChange = (total, received) => {
  return Math.max(0, received - total);
};
