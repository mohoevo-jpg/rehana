export const required = (val) => !!val;

export const minLength = (min) => (val) => val && val.length >= min;

export const isNumber = (val) => !isNaN(val) && val !== null;

export const validateProduct = (product) => {
  const errors = {};
  if (!product.name) errors.name = 'اسم المنتج مطلوب';
  if (!product.price || product.price <= 0) errors.price = 'السعر يجب أن يكون أكبر من 0';
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
