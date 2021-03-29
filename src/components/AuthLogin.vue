<template>
  <div class="container">
    <div class="flexbox cardStyle cardBackground">
      <form @submit.prevent="login">
        <!-- Email -->
        <ion-row class="ion-align-items-baseline ">
          <ion-col size="1" class="ion-margin-horizontal">
            <ion-icon :icon="email"></ion-icon>
          </ion-col>
          <ion-col>
            <ion-input
              name="email"
              @change="v$.email.$touch()"
              v-model="state.email"
              :class="{
                invalid: v$.email.$invalid && v$.email.$dirty,
              }"
              placeholder="Email"
            >
            </ion-input>
          </ion-col>
        </ion-row>

        <!-- Password -->
        <ion-row class="ion-align-items-baseline ">
          <ion-col size="1" class="ion-margin-horizontal">
            <ion-icon :icon="password"></ion-icon>
          </ion-col>
          <ion-col>
            <ion-input
              name="password"
              @change="v$.email.$touch()"
              :class="{
                invalid: v$.password.$invalid && v$.password.$dirty,
              }"
              v-model="state.password"
              type="password"
              placeholder="Password"
            ></ion-input>
          </ion-col>
        </ion-row>

        <ion-button
          type="submit"
          class="btn btn-login"
          expand="block"
          shape="round"
        >
          Login
        </ion-button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, reactive } from "vue";
import { at, key } from "ionicons/icons";
import {
  alertController,
  IonButton,
  IonCol,
  IonIcon,
  IonInput,
  IonRow,
} from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { auth, userCollection } from "@/firebase";
import { useRouter } from "vue-router";
import { useStore } from "@/store/store";
import { User } from "@/models/Usuario";
import { ActionTypes } from "@/store/action-types";

export default {
  components: {
    IonRow,
    IonCol,
    IonIcon,
    IonInput,
    IonButton,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      email: "",
      password: "",
    });

    const rules = computed(() => {
      return {
        email: {
          required,
          email,
        },
        password: {
          required,
        },
      };
    });

    const v$ = useVuelidate(rules, state);

    async function presentAlert(header: string, message: string) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header,
        message,
        buttons: ["OK"],
      });
      return alert.present();
    }
    function login() {
      v$.value.$validate();
      if (v$.value.$error) return;

      auth
        .signInWithEmailAndPassword(state.email, state.password)
        .then(user => {
          userCollection
            .doc(user.user?.uid)
            .get()
            .then(docData => {
              if (!docData.exists) {
                presentAlert("Error", "User not fount in our dataBase");
                return;
              }
              const userDB = docData.data() as User;
              store.dispatch(ActionTypes.SET_USER, userDB);
              router.push("/");
            });
        });
    }

    return { v$, state, login, email: at, password: key };
  },
};
</script>

<style scoped>
@import "../assets/style/auth.css";

.container {
  height: 100%;
}

.flexbox {
  position: relative;
  z-index: 1;
  width: 90vw;
}
</style>
