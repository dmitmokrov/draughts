import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import PrimeVue from 'primevue/config';

import App from './App.vue';
import router from './router';

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue);
app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore
  .initializeAuthListener()
  .then(() => {
    console.log('✅ Auth initialization complete');
    app.mount('#app');
  })
  .catch((error) => {
    console.error('❌ Auth initialization failed:', error);
    app.mount('#app'); // Все равно маунтим приложение
  });

export { authStore };
