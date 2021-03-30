<template>
  <AuthCard @submit="login">
    <template #form>
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
    </template>
    <template #button-text>Login</template>
  </AuthCard>
</template>

<script lang="ts">
import { computed, reactive } from "vue";
import { at, key } from "ionicons/icons";
import { alertController, IonCol, IonIcon, IonInput, IonRow } from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { auth, userCollection } from "@/firebase";
import { useRouter } from "vue-router";
import { useStore } from "@/store/store";
import { User } from "@/models/Users";
import { ActionTypes } from "@/store/action-types";
import AuthCard from "@/components/AuthCard.vue";

export default {
  components: {
    IonRow,
    IonCol,
    IonIcon,
    IonInput,
    AuthCard,
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
