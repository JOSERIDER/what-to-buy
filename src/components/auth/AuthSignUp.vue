<template>
  <div class="p-4 flex flex-col justify-center">
    <h1 class="text-5xl text-gray-400 font-bold my-4">Register</h1>
    <div class="space-y-4">
      <!-- Email -->
      <VInput
        class="rounded-full shadow"
        :v$="v$.email"
        v-model:value.trim="s.email"
        placeholder="Email"
        :icon="email"
        enterkeyhint="next"
        @enter="$refs.userName.setFocus()"
        input-mode="email"
        name="email"
      />

      <!-- Name -->
      <VInput
        ref="userName"
        class="rounded-full shadow"
        :v$="v$.name"
        v-model:value.trim="s.name"
        placeholder="User name"
        enterkeyhint="next"
        @enter="$refs.listName.setFocus()"
        :icon="person"
        name="userName"
      />

      <!-- sharedList name -->
      <VInput
        ref="listName"
        class="rounded-full shadow"
        :v$="v$.listName"
        v-model:value.trim="s.listName"
        enterkeyhint="next"
        @enter="$refs.signUp_password.setFocus()"
        placeholder="Name of your shared list"
        :icon="list"
        name="listName"
      />

      <!-- Password -->
      <VInput
        class="rounded-full shadow"
        ref="signUp_password"
        :v$="v$.password"
        v-model:value.trim="s.password"
        enterkeyhint="done"
        @enter="signUp"
        placeholder="Password"
        :icon="password"
        name="password"
        type="password"
      />
    </div>

    <div class="mt-5 w-full">
      <ion-button
        @click="signUp"
        expand="block"
        shape="round"
        v-show="!loading"
      >
        Sign Up
      </ion-button>
      <ion-button expand="block" shape="round" v-if="loading">
        <VSpinnerButtonLoading />
      </ion-button>
    </div>
    <p
      @click="$emit('change-component', 'AuthLogin')"
      class="signIn text-sm text-center pt-4 font-bold"
    >
      Already a member? Sign in
    </p>
  </div>
</template>

<script lang="ts">
import useVuelidate from "@vuelidate/core";
import VSpinnerButtonLoading from "@/components/ui/VSpinnerButtonLoading.vue";
import { computed, reactive } from "vue";
import { at, key, listOutline, personOutline } from "ionicons/icons";
import { email, minLength, required } from "@vuelidate/validators";
import VInput from "@/components/ui/VInput.vue";
import { ActionType } from "@/models/store";
import { useAuthsStore } from "@/store/auth";
import router from "@/router";
import { useKeyboard } from "@/use/useKeyboard";
import { IonButton } from "@ionic/vue";

export default {
  components: {
    VInput,
    IonButton,
    VSpinnerButtonLoading,
  },
  setup() {
    const authStore = useAuthsStore();
    const { hideKeyboard } = useKeyboard();
    const state = reactive({
      name: "",
      email: "",
      password: "",
      listName: "",
    });

    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(3) },
        email: { required, email },
        password: { required, minLength: minLength(5) },
        listName: {},
      };
    });

    const loading = computed(() => {
      return authStore.state.loading;
    });

    const v$ = useVuelidate(rules, state);

    async function signUp() {
      await v$.value.$validate();

      if (v$.value.$error) return;

      await hideKeyboard();
      await authStore.action(ActionType.auth.signUp, {
        email: state.email,
        password: state.password,
        listName: state.listName,
        userName: state.name,
      });

      if (authStore.state.error) return;

      await router.push({ name: "Dashboard" });
    }

    return {
      s: state,
      v$,
      signUp,
      loading,
      email: at,
      list: listOutline,
      password: key,
      person: personOutline,
    };
  },
};
</script>
<style scoped>
.signIn {
  color: #0899ba;
}
</style>
