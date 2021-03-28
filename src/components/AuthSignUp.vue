<template>
  <div class="container">
    <div class="flexbox cardStyle cardBackground">
      <form @submit.prevent="signUp">
        <!-- Email -->
        <ion-row class=" ion-align-items-baseline ">
          <ion-col size="1" class="ion-margin-horizontal">
            <ion-icon :icon="email"></ion-icon>
          </ion-col>
          <ion-col>
            <ion-input
              v-model="state.email"
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
              v-model="state.name"
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
              v-model="state.listName"
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
              v-model="state.password"
              @change="v$.password.$touch()"
              :class="{ invalid: v$.password.$invalid && v$.password.$dirty }"
              type="password"
              placeholder="Password"
            ></ion-input>
          </ion-col>
        </ion-row>

        <ion-button
          type="submit"
          class="btn btn-login"
          expand="block"
          shape="round"
        >
          Sign up
        </ion-button>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { IonRow, IonCol, IonIcon, IonInput, IonButton } from "@ionic/vue";
import { at, key, personOutline, listOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { firestore, firebaseAuth } from "@/db/firebase";

export default {
  components: {
    IonRow,
    IonCol,
    IonIcon,
    IonInput,
    IonButton,
  },
  setup() {
    const router = useRouter();

    const colors = [
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

    function createUser(id, email, name, sharedListIdentifier, qrUrl) {
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

    function createIdentifier() {
      return new Date().getTime().toString();
    }

    const qrURL = (id) =>
      `https://api.qrserver.com/v1/create-qr-code/?data=${id}&size=200x200`;

    function generateListColor() {
      const color = Math.round(Math.random() * colors.length);
      return colors[color];
    }

    function signUp() {
      v$.value.$validate();
      if (v$.value.$error === true) {
        return;
      }

      function createSharedList(user, sharedListName, sharedListIdentifier) {
        const users = [];
        const color = generateListColor();
        users.unshift(user.id);
        return {
          users,
          admin: user.id,
          products: [],
          name: sharedListName,
          listCode: sharedListIdentifier,
          color,
        };
      }

      firebaseAuth
        .createUserWithEmailAndPassword(state.email, state.password)
        .then((user) => {
          const sharedListIdentifier = createIdentifier();
          debugger;
          const newUser = createUser(
            user.user.uid,
            email,
            name,
            sharedListIdentifier,
            qrURL(sharedListIdentifier)
          );
          const sharedList = createSharedList(
            newUser,
            this.listName,
            sharedListIdentifier
          );
          console.log(sharedList);
          //save user in firestore.
          //router.push("/");
        });
    }

    return {
      state,
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

<style scoped>
@import "../assets/style/auth.css";

.container {
  height: 100%;
}

.flexbox {
  position: relative;
  z-index: 1;
  width: 90vw;
}

.text {
  bottom: 0;
  margin-bottom: 1rem;
  background-color: rgba(228, 228, 228, 0.74);
}
.text ion-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
</style>
