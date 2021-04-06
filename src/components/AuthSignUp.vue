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
import { auth } from "@/repository/Client/firebaseClient.js";
import { repositories, repositoryTypes } from "@/repository/RepositoryFactory";
import { User, UserBuild } from "@/models/Users";
import { SharedList, SharedListBuild } from "@/models/SharedList";
import { useStore } from "@/store/store";
import { ActionTypes } from "@/store/action-types";
import VInput from "@/components/VInput.vue";

export default {
  components: {
    VInput,
    AuthCard,
  },
  setup() {
    const userRepository = repositories[repositoryTypes.USER_REPOSITORY];
    const sharedListRepository =
      repositories[repositoryTypes.SHARED_LIST_REPOSITORY];

    const router = useRouter();
    const store = useStore();

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
      userRepository.create(user).then(() => {
        sharedListRepository.create(sharedList).then(async () => {
          await store.dispatch(ActionTypes.SET_USER, user);
          await router.push({ name: "Dashboard" });
        });
      });
    }

    function signUp() {
      v$.value.$validate();
      if (v$.value.$error) return;

      auth
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
