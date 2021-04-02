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
import { auth, userCollection } from "@/firebase";
import { User } from "@/models/Users";
import { SharedList } from "@/models/List";
import firebase from "firebase";
import { useStore } from "@/store/store";
import { ActionTypes } from "@/store/action-types";
import DocumentData = firebase.firestore.DocumentData;
import VInput from "@/components/VInput.vue";

export default {
  components: {
    VInput,
    AuthCard,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const colors: string[] = [
      "#FF2626",
      "#D73E68",
      "#B300B3",
      "#8D18AB",
      "#5B5BFF",
      "#25A0C5",
      "#5EAE9E",
    ];

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

    function createUser(
      id: string,
      email: string,
      name: string,
      sharedListIdentifier: string,
      qrUrl: string
    ): User {
      return {
        id,
        email,
        name,
        mysharedList: sharedListIdentifier,
        privateList: [],
        sharedList: [sharedListIdentifier],
        qrUrl,
      };
    }

    function createIdentifier(): string {
      return new Date().getTime().toString();
    }

    const qrURL = (id: string) =>
      `https://api.qrserver.com/v1/create-qr-code/?data=${id}&size=200x200`;

    function generateListColor(): string {
      const color = Math.round(Math.random() * colors.length);
      return colors[color];
    }

    function createSharedList(
      user: User,
      shareListName: string,
      listCode: string
    ): SharedList {
      const users: string[] = [];
      const color = generateListColor();

      //Create a default name list based on user name followed list.
      if (shareListName === "") {
        shareListName = `${user.name}-list`;
      }

      return {
        users,
        admin: user.id,
        products: [],
        name: shareListName,
        listCode: listCode,
        color,
      };
    }

    function saveUserAndUserListOnFirestore(
      user: User,
      sharedList: SharedList
    ) {
      //Save user on firestore.
      userCollection
        .doc(user.id)
        .set(user as DocumentData)
        .then(() => {
          //Save shared list on firestore
          userCollection
            .doc(sharedList.listCode)
            .set(sharedList)
            .then(() => {
              store.dispatch(ActionTypes.SET_USER, user);
              router.push({ name: "Dashboard" });
            });
        });
    }

    function signUp() {
      v$.value.$validate();
      if (v$.value.$error) return;

      auth
        .createUserWithEmailAndPassword(state.email, state.password)
        .then((user: any) => {
          const sharedListIdentifier = createIdentifier();
          const newUser: User = createUser(
            user.user.uid,
            state.email,
            state.name,
            sharedListIdentifier,
            qrURL(sharedListIdentifier)
          );

          const sharedList: SharedList = createSharedList(
            newUser,
            state.listName,
            sharedListIdentifier
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
