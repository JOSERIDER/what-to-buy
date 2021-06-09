<template>
  <div class="flex flex-col justify-center mt-10 p-4">
    <h1 class="text-5xl text-gray-400 font-bold my-4">Sign In</h1>
    <div class="space-y-4">
      <!-- Email -->
      <VInput
        :v$="v$.email"
        class="rounded-full shadow"
        v-model:value="state.email"
        placeholder="Email"
        :icon="email"
        enterkeyhint="next"
        @enter="$refs.pass.setFocus()"
        input-mode="email"
        name="email"
      />

      <!-- Password -->
      <VInput
        class="rounded-full shadow"
        ref="pass"
        :v$="v$.password"
        v-model:value="state.password"
        placeholder="Password"
        enterkeyhint="done"
        :clearInput="true"
        :icon="password"
        @enter="login"
        name="password"
        type="password"
      />
    </div>
    <div class="mt-5 w-full">
      <ion-button @click="login" expand="block" shape="round" v-show="!loading">
        Sign In
      </ion-button>
      <ion-button expand="block" shape="round" v-if="loading">
        <VSpinnerButtonLoading />
      </ion-button>
    </div>
    <p
      @click="$emit('change-component', 'AuthSignUp')"
      class="register text-sm text-center pt-4 font-bold"
    >
      Don't have an account? Sign up
    </p>
  </div>
</template>

<script lang="ts">
import VInput from "@/components/ui/VInput.vue";
import VSpinnerButtonLoading from "@/components/ui/VSpinnerButtonLoading.vue";
import { computed, reactive } from "vue";
import { at, key } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { ActionType } from "@/models/store";
import { useAuthsStore } from "@/store/auth";
import router from "@/router";
import { useKeyboard } from "@/use/useKeyboard";
import { IonButton } from "@ionic/vue";

export default {
  components: {
    VInput,
    VSpinnerButtonLoading,
    IonButton,
  },
  setup() {
    const authStore = useAuthsStore();
    const { hideKeyboard } = useKeyboard();
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

    const loading = computed(() => {
      return authStore.state.loading;
    });

    const v$ = useVuelidate(rules, state);

    async function login() {
      await v$.value.$validate();

      if (v$.value.$error) return;

      await hideKeyboard();
      await authStore.action(ActionType.auth.login, {
        email: state.email,
        password: state.password,
      });

      if (authStore.state.error) return;

      await router.push({ name: "Dashboard" });
    }

    return { v$, state, loading, login, email: at, password: key };
  },
};
</script>
<style scoped>
.register {
  color: #0899ba;
}
</style>
