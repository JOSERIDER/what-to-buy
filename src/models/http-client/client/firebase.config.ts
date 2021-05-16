import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

//Firebase configuration.
const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DB_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SECRET_ID,
  appId: process.env.VUE_APP_APP_ID,
};

// Initialize Firebase
const firebaseApp = firebase.default.initializeApp(firebaseConfig);

export const firestore = firebaseApp.firestore();

export const auth = firebaseApp.auth();

export const storage = url => firebaseApp.storage(url);
