<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Create new list</ion-title>
      <ion-button @click="close()" fill="clear" slot="end" color="primary">
        <ion-text>Close</ion-text>
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div class="m-4">
      <ion-text>
        <h2>
          Create a new list is very easy, just type a cool name and press create
          button.
        </h2>
      </ion-text>
      <VInput
        class="mt-4"
        :border="true"
        v-model:value="state.name"
        :v$="v$.name"
        placeholder="Next weekend BBQ"
        name="listName"
      />

      <p v-if="v$.$error" class="ml-1 text-xs">
        Name have to almost three characters of length
      </p>

      <div class="flex w-full justify-center mt-4">
        <ion-button @click="createList" fill="clear">Create list</ion-button>
      </div>
    </div>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import VInput from "@/components/VInput.vue";
import { computed, defineComponent, reactive } from "vue";
import { minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { User } from "@/models/Users";
import { ListBuild } from "@/models/List";
import { modalController } from "@ionic/vue";
import apiClient from "@/api-client";
import { useUserStore } from "@/store/user";

export default defineComponent({
  name: "DashBoardModalCreateList",
  components: {
    VInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonButton,
  },
  setup() {
    const user: User = useUserStore().state.user;
    const privateListApiClient = apiClient.privateLists;

    const state = reactive({
      name: "",
    });

    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(3) },
      };
    });
    const v$ = useVuelidate(rules, state);

    async function close() {
      await modalController.dismiss();
    }

    async function createList() {
      await v$.value.$validate();
      if (v$.value.$error) return;
      await privateListApiClient
        .create(ListBuild.build(user.id as string, state.name as string))
        .then(async () => await close());
    }

    return { state, v$, createList, close };
  },
});
</script>
