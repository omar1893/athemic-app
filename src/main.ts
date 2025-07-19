import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import config from '@/config';
import GoogleLoginPlugin from 'vue3-google-login';

import { IonicVue } from '@ionic/vue';
import { Quasar, Ripple } from 'quasar'

// Import Quasar css
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import 'quasar/src/css/index.sass'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.scss';

const app = createApp(App)
  .use(IonicVue)
  .use(createPinia())
  .use(GoogleLoginPlugin, {
    clientId: config.GOOGLE_CLIENT_ID
  })
  .use(Quasar, {
    plugins: {},
    directives: {
      Ripple
    },
    config: {
      brand: {
        primary: '#875EF8',
        secondary: '#42E2E9',
        accent: '#170033',
        dark: '#1D1D1D',
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037'
      }
    }
  })
  .use(router);

// Load stored authentication
const authStore = useAuthStore();
authStore.loadStoredAuth();

router.isReady().then(() => {
  app.mount('#app');
});
