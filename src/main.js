import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import pinia from './store';
import './assets/styles/main.css';
import ar from './locales/ar';
import en from './locales/en';

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'ar',
  fallbackLocale: 'en',
  messages: {
    ar,
    en
  }
});

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);

try {
  app.mount('#app');
  console.log('Vue app mounted successfully');
} catch (err) {
  console.error('Failed to mount Vue app:', err);
}
