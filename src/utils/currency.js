import { useSettingsStore } from '../store/settings';

export const formatCurrency = (amount) => {
  const settings = useSettingsStore();
  
  return new Intl.NumberFormat(settings.currencyLocale, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseCurrency = (input) => {
  if (typeof input === 'number') return input;
  return Number(input.replace(/[^0-9.-]+/g, ""));
};
