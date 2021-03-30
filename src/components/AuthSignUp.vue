<template>
  <AuthCard @submit="signUp">
    <template #form>
      <!-- Email -->
      <ion-row class=" ion-align-items-baseline ">
        <ion-col size="1" class="ion-margin-horizontal">
          <ion-icon :icon="email"></ion-icon>
        </ion-col>
        <ion-col>
          <ion-input
            v-model="s.email"
            @change="v$.email.$touch()"
            :class="{ invalid: v$.email.$invalid && v$.email.$dirty }"
            name="email"
            placeholder="Email"
          >
          </ion-input>
        </ion-col>
      </ion-row>

      <!-- Name -->
      <ion-row class=" ion-align-items-baseline ">
        <ion-col size="1" class="ion-margin-horizontal">
          <ion-icon :icon="person"></ion-icon>
        </ion-col>
        <ion-col>
          <ion-input
            v-model="s.name"
            @change="v$.name.$touch()"
            :class="{ invalid: v$.name.$invalid && v$.name.$dirty }"
            name="userName"
            type="text"
            placeholder="Name"
          ></ion-input>
        </ion-col>
      </ion-row>

      <!-- sharedList name -->
      <ion-row class=" ion-align-items-baseline ">
        <ion-col size="1" class="ion-margin-horizontal">
          <ion-icon :icon="list"></ion-icon>
        </ion-col>
        <ion-col>
          <ion-input
            v-model="s.listName"
            type="text"
            placeholder="Name of your list"
          ></ion-input>
        </ion-col>
      </ion-row>

      <!-- Password -->
      <ion-row class=" ion-align-items-baseline ">
        <ion-col size="1" class="ion-margin-horizontal">
          <ion-icon :icon="password"></ion-icon>
        </ion-col>
        <ion-col>
          <ion-input
            v-model="s.password"
            @change="v$.password.$touch()"
            :class="{ invalid: v$.password.$invalid && v$.password.$dirty }"
            type="password"
            placeholder="Password"
          ></ion-input>
        </ion-col>
      </ion-row>
    </template>
    <template #button-text>Sign up</template>
  </AuthCard>
</template>

<script lang="ts">
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { IonCol, IonIcon, IonInput, IonRow } from "@ionic/vue";
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

export default {
  components: {
    IonRow,
    IonCol,
    IonIcon,
    IonInput,
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

    const s = reactive({
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

    const v$ = useVuelidate(rules, s);

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
              router.push("/");
            });
        });
    }

    function signUp() {
      v$.value.$validate();
      if (v$.value.$error) return;

      auth
        .createUserWithEmailAndPassword(s.email, s.password)
        .then((user: any) => {
          const sharedListIdentifier = createIdentifier();
          debugger;
          const newUser: User = createUser(
            user.user.uid,
            s.email,
            s.name,
            sharedListIdentifier,
            qrURL(sharedListIdentifier)
          );

          const sharedList: SharedList = createSharedList(
            newUser,
            s.listName,
            sharedListIdentifier
          );

          saveUserAndUserListOnFirestore(newUser, sharedList);
        });
    }

    return {
      s,
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
