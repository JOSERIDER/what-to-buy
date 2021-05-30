<template>
  <AuthCard :button-enabled="!loading" @submit="login">
    <template #form>
      <!-- Email -->
      <VInput
        :v$="v$.email"
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
    </template>
    <template v-if="!loading" #button-text>Login</template>
    <template v-else #button-text><VSpinnerButtonLoading /></template>
  </AuthCard>
</template>

<script lang="ts">
import AuthCard from "@/components/auth/AuthCard.vue";
import VInput from "@/components/ui/VInput.vue";
import VSpinnerButtonLoading from "@/components/ui/VSpinnerButtonLoading.vue";
import { computed, reactive } from "vue";
import { at, key } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { ActionType } from "@/models/store";
import { useAuthsStore } from "@/store/auth";
import router from "@/router";

export default {
  components: {
    VInput,
    AuthCard,
    VSpinnerButtonLoading,
  },
  setup() {
    const authStore = useAuthsStore();

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
