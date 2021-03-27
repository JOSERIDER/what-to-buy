import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { IonicVue } from '@ionic/vue';
import firebase from 'firebase';

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

/* Theme variables */
import './theme/variables.css';

//Firebase configuration.
const firebaseConfig =  {
    apiKey: "AIzaSyCXOS4cM2D7PmFW_o3C9gJdMZDxQT5OnSY",
    authDomain: "shopping-list-93c19.firebaseapp.com",
    databaseURL: "https://shopping-list-93c19.firebaseio.com",
    projectId: "shopping-list-93c19",
    storageBucket: "shopping-list-93c19.appspot.com",
    messagingSenderId: "412106886941",
    appId: "1:412106886941:web:b934ce2063c2840700dbf4"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = createApp(App)
  .use(IonicVue)
  .use(router);
  
router.isReady().then(() => {
  app.mount('#app');
});