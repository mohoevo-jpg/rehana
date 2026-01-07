import { defineStore } from 'pinia';
import api from '../services/api';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // General Info
    shopName: localStorage.getItem('settings_shopName') || 'متجر ريحانة',
    address: localStorage.getItem('settings_address') || 'الموصل - حي الزهور',
    phone: localStorage.getItem('settings_phone') || '07700000000',
    email: localStorage.getItem('settings_email') || '',
    
    // Social Media
    facebookUrl: localStorage.getItem('settings_facebookUrl') || '',
    instagramUrl: localStorage.getItem('settings_instagramUrl') || '',
    telegramUrl: localStorage.getItem('settings_telegramUrl') || '',
    websiteUrl: localStorage.getItem('settings_websiteUrl') || '',
    
    // Localization
    language: localStorage.getItem('settings_language') || 'ar',
    currency: localStorage.getItem('settings_currency') || 'IQD',
    currencyLocale: localStorage.getItem('settings_currencyLocale') || 'ar-IQ',
    
    // Appearance
    theme: localStorage.getItem('settings_theme') || 'light',
    primaryColor: localStorage.getItem('settings_primaryColor') || '#0ea5e9', // Sky-500
    
    // Invoice / Printing
    printerName: localStorage.getItem('settings_printerName') || null,
    invoiceHeader: localStorage.getItem('settings_invoiceHeader') || 'أهلاً بكم في متجر ريحانة',
    invoiceFooter: localStorage.getItem('settings_invoiceFooter') || 'شكراً لزيارتكم',
    showLogoOnInvoice: localStorage.getItem('settings_showLogoOnInvoice') === 'true',
    invoiceLogoUrl: localStorage.getItem('settings_invoiceLogoUrl') || '',
    invoicePaperSize: localStorage.getItem('settings_invoicePaperSize') || '80mm',
    invoiceFontSize: Number(localStorage.getItem('settings_invoiceFontSize')) || 12,
    showCashierName: localStorage.getItem('settings_showCashierName') !== 'false',
    showCustomerInfo: localStorage.getItem('settings_showCustomerInfo') !== 'false',
    showSocialMediaOnInvoice: localStorage.getItem('settings_showSocialMediaOnInvoice') !== 'false',

    // Barcode Settings
    barcodeWidth: Number(localStorage.getItem('settings_barcodeWidth')) || 2,
    barcodeHeight: Number(localStorage.getItem('settings_barcodeHeight')) || 100,
    barcodeFormat: localStorage.getItem('settings_barcodeFormat') || 'CODE128',
    barcodeShowText: localStorage.getItem('settings_barcodeShowText') !== 'false',
    barcodeFontSize: Number(localStorage.getItem('settings_barcodeFontSize')) || 20,
    barcodeMargin: Number(localStorage.getItem('settings_barcodeMargin')) || 10,

    // Report Settings
    reportHeaderTitle: localStorage.getItem('settings_reportHeaderTitle') || 'تقرير المبيعات',
    reportFooterText: localStorage.getItem('settings_reportFooterText') || 'تم استخراج التقرير من نظام ريحانة',
    reportPrimaryColor: localStorage.getItem('settings_reportPrimaryColor') || '#0ea5e9',
    reportShowLogo: localStorage.getItem('settings_reportShowLogo') !== 'false',
    reportShowDate: localStorage.getItem('settings_reportShowDate') !== 'false',
    reportFontSize: Number(localStorage.getItem('settings_reportFontSize')) || 14,
    reportBorderColor: localStorage.getItem('settings_reportBorderColor') || '#e5e7eb',

    // System
    enableNotifications: localStorage.getItem('settings_enableNotifications') !== 'false',
    autoBackup: localStorage.getItem('settings_autoBackup') === 'true',

    // App Updates & Announcements (Synced from Backend)
    minAppVersion: '1.0.0',
    latestAppVersion: '1.0.0',
    updateUrl: '',
    updateMessage: 'تحديث جديد متوفر، يرجى التحديث للحصول على آخر المميزات',
    welcomeMessage: 'تم إنشاء الحساب بنجاح!\nحصلت على رصيد ترحيبي بقيمة {amount} د.ع هدية مقدمة من تطبيق ريحانة.\nنتمنى لك تجربة تسوق ممتعة.',
    welcomeBonus: 3000,
    announcement: {
      active: false,
      title: 'تنبيه هام',
      message: ''
    },
    rewardSystem: {
      active: true,
      threshold: 35000,
      amount: 1000,
      message: 'لانك زبون مميز لدينا هاي 1000 دينار رصيد استخدمه في طلبك القادم'
    }
  }),
  actions: {
    // Fetch settings from backend
    async fetchSettings() {
      try {
        const response = await api.get('/settings'); // Assuming api service is imported
        if (response.data) {
          this.updateSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    },
    
    async saveSettingsToBackend(newSettings) {
      try {
        const response = await api.post('/settings', newSettings);
        if (response.data.success) {
           this.updateSettings(response.data.settings);
           return true;
        }
      } catch (error) {
         console.error('Failed to save settings:', error);
         return false;
      }
    },

    updateSettings(settings) {
      this.$patch(settings);
      
      // Persist all settings
      Object.keys(settings).forEach(key => {
        // Skip complex objects from localStorage if needed, or stringify
        if (typeof settings[key] === 'object') {
           localStorage.setItem(`settings_${key}`, JSON.stringify(settings[key]));
        } else {
           localStorage.setItem(`settings_${key}`, settings[key]);
        }
      });

      // Apply side effects (like theme)
      if (settings.primaryColor) {
        this.applyPrimaryColor(settings.primaryColor);
      }
    },
    
    applyPrimaryColor(color) {
      // Logic to update CSS variables would go here or in App.vue watcher
      document.documentElement.style.setProperty('--color-primary-600', color);
      // Note: Full Tailwind dynamic colors require more complex setup, 
      // for now we might handle this via inline styles or just variable replacement
    }
  }
});
