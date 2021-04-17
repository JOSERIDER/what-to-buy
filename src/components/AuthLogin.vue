<template>
  <AuthCard @submit="login">
    <template #form>
      <!-- Email -->
      <VInput
        :v$="v$.email"
        v-model:value="state.email"
        placeholder="Email"
        :icon="email"
        name="email"
      />

      <!-- Password -->
      <VInput
        :v$="v$.password"
        v-model:value="state.password"
        placeholder="Password"
        :icon="password"
        name="password"
        type="password"
      />
    </template>
    <template #button-text>Login</template>
  </AuthCard>
</template>

<script lang="ts">
import AuthCard from "@/components/AuthCard.vue";
import VInput from "@/components/VInput.vue";
import { computed, reactive } from "vue";
import { at, key } from "ionicons/icons";
import { alertController } from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { useStore } from "@/store/store";
import { ActionTypes } from "@/store/action-types";
import apiClient from "@/api-client";
import { auth } from "@/models/http-client/client/firebase.config";

export default {
  components: {
    VInput,
    AuthCard,
  },
  setup() {
    const userApiClient = apiClient.users;
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
          userApiClient.get(user.user?.uid as string).then(async user => {
            if (!user) {
              await presentAlert("Error", "User not fount in our dataBase");
              return;
            }
            await store.dispatch(ActionTypes.SET_USER, user);
            await router.push("/");
          });
        });
    }

    return { v$, state, login, email: at, password: key };
  },
};
</script>
