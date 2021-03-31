import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { onUnmounted, ref } from "vue";

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

export const db = firebaseApp.firestore();

export const auth = firebaseApp.auth();
export const userCollection = db.collection("usuarios");
export const sharedListCollection = db.collection("sharedList");
export const privateListCollection = db.collection("privateList");

//Query user private list
export function usePrivateList(privateList) {
  const lists = ref([]);
  const unsubscribe = privateListCollection.onSnapshot(snapshot => {
    snapshot.docs.forEach(doc => {
      const list = doc.data();
      if (privateList.includes(list.listCode)) {
        lists.value.push(list);
      }
    });
  });
  onUnmounted(unsubscribe);

  return lists;
}

//Query user shared list
export function useSharedList(sharedList) {
  const lists = ref([]);
  const unsubscribe = sharedListCollection.onSnapshot(snapshot => {
    snapshot.docs.map(doc => {
      const list = doc.data();
      if (sharedList.includes(list.listCode)) {
        lists.value.push(list);
      }
    });
  });
  onUnmounted(unsubscribe);

  return lists;
}
