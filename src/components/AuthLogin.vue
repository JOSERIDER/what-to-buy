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

<script>
import { computed, reactive, onUnmounted } from "vue";
import { at, key } from "ionicons/icons";
import { IonRow, IonCol, IonIcon, IonInput, IonButton } from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { firebaseAuth } from "@/db/firebase";
import { useRouter } from "vue-router";

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

    function login() {
      v$.value.$validate();
      if (v$.value.$error === false) {
        firebaseAuth
          .signInWithEmailAndPassword(state.email, state.password)
          .then((user) => {
            //Save vuex user
            router.push("/");
          });
      }
    }

    onUnmounted(() => {
      v$.$reset();
    });

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
