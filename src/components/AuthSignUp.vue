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
    <template #button-text>Sign up</template>
  </AuthCard>
</template>

<script lang="ts">
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { at, key, listOutline, personOutline } from "ionicons/icons";
import AuthCard from "@/components/AuthCard.vue";
import useVuelidate from "@vuelidate/core";
import { email, minLength, required } from "@vuelidate/validators";
import { User, UserBuild } from "@/models/Users";
import { SharedList, SharedListBuild } from "@/models/SharedList";
import VInput from "@/components/VInput.vue";
import apiClient, { firebaseAuth } from "@/api-client";
import { useUserStore } from "@/store/user";
import { MutationType } from "@/models/store";
import firebase from "firebase";

export default {
  components: {
    VInput,
    AuthCard,
  },
  setup() {
    const userApiClient = apiClient.users;
    const sharedListApiClient = apiClient.sharedLists;

    const router = useRouter();
    const userProfileStore = useUserStore();

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

    const v$ = useVuelidate(rules, state);

    function saveUserAndUserListOnFirestore(
      user: User,
      sharedList: SharedList
    ) {
      userApiClient.create(user).then(() => {
        sharedListApiClient.create(sharedList).then(async () => {
          firebaseAuth.currentUser?.updateProfile({
            displayName: user.name,
          });

          await userProfileStore.action(MutationType.user.setUser, user);
          await router.push({ name: "Dashboard" });
        });
      });
    }

    function createUser() {
      firebaseAuth
        .createUserWithEmailAndPassword(state.email, state.password)
        .then((user: any) => {
          const sharedList: SharedList = SharedListBuild.build(
            user.user.uid,
            state.listName
          );

          const newUser: User = UserBuild.build(
            user.user.uid,
            state.email,
            state.name,
            sharedList.listCode
          );

          saveUserAndUserListOnFirestore(newUser, sharedList);
        });
    }

    function signUp() {
      v$.value.$validate();
      if (v$.value.$error) return;
      firebaseAuth
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => createUser());
    }

    return {
      s: state,
      v$,
      signUp,
      email: at,
      list: listOutline,
      password: key,
      person: personOutline,
    };
  },
};
</script>
