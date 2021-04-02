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
import { computed, reactive } from "vue";
import { at, key } from "ionicons/icons";
import { alertController } from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { auth, userCollection } from "@/firebase";
import { useRouter } from "vue-router";
import { useStore } from "@/store/store";
import { User } from "@/models/Users";
import { ActionTypes } from "@/store/action-types";
import AuthCard from "@/components/AuthCard.vue";
import VInput from "@/components/VInput.vue";

export default {
  components: {
    VInput,
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
