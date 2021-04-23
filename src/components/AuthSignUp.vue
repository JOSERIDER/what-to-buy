<template>
  <AuthCard @submit="signUp">
    <template #form>
      <!-- Email -->
      <VInput
        :v$="v$.email"
        v-model:value="s.email"
        placeholder="Email"
        :icon="email"
        name="Email"
      />

      <!-- Name -->
      <VInput
        :v$="v$.name"
        v-model:value="s.name"
        placeholder="userName"
        :icon="person"
        name="userName"
      />

      <!-- sharedList name -->
      <VInput
        :v$="v$.listName"
        v-model:value="s.listName"
        placeholder="Name of your shared list"
        :icon="list"
        name="listName"
      />

      <!-- Password -->
      <VInput
        :v$="v$.password"
        v-model:value="s.password"
        placeholder="Password"
        :icon="password"
        name="password"
        type="password"
      />
    </template>
    <template v-if="!loading" #button-text>Sign up</template>
    <template v-else #button-text><VSpinnerButtonLoading /></template>
  </AuthCard>
</template>

<script lang="ts">
import AuthCard from "@/components/AuthCard.vue";
import useVuelidate from "@vuelidate/core";
import VSpinnerButtonLoading from "@/components/VSpinnerButtonLoading.vue";
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { at, key, listOutline, personOutline } from "ionicons/icons";
import { email, minLength, required } from "@vuelidate/validators";
import VInput from "@/components/VInput.vue";
import { useUserStore } from "@/store/user";
import { ActionType } from "@/models/store";
import { useAuthsStore } from "@/store/auth";
import { useListsStore } from "@/store/lists";
import { User, UserBuild } from "@/models/domain/user";
import { SharedList, SharedListBuild } from "@/models/domain/sharedList";

export default {
  components: {
    VInput,
    AuthCard,
    VSpinnerButtonLoading,
  },
  setup() {
    const listsStore = useListsStore();
    const authStore = useAuthsStore();
    const router = useRouter();
    const userStore = useUserStore();

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
      return userStore.state.isLoading || authStore.state.loading;
    });

    const v$ = useVuelidate(rules, state);

    async function createUser(listCode: string) {
      const user: User = UserBuild.build(
        authStore.state.user.user.uid,
        state.email,
        state.name,
        listCode
      );
      await userStore.action(ActionType.user.createUser, user);
    }

    async function saveUserAndSharedList() {
      const sharedList: SharedList = SharedListBuild.build(
        authStore.state.user.user.uid,
        state.listName
      );
      await createUser(sharedList.listCode);

      await listsStore.action(
        ActionType.lists.createUserSharedList,
        sharedList
      );
    }

    async function signUp() {
      await v$.value.$validate();
      if (v$.value.$error) return;
      await authStore.action(ActionType.auth.signUp, {
        email: state.email,
        password: state.password,
      });
      await saveUserAndSharedList();
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
