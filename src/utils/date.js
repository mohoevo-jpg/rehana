import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'PPP') => {
  return format(new Date(date), formatStr, { locale: ar });
};

export const formatTime = (date) => {
  return format(new Date(date), 'p', { locale: ar });
};
