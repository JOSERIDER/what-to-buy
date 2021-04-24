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
        <ion-button v-if="!loading" @click="createList" fill="clear"
          >Create list</ion-button
        >
        <VSpinner v-else />
      </div>
    </div>
  </ion-content>
</template>

<script lang="ts">
import {
  alertController,
  IonButton,
  IonContent,
  IonHeader,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import VInput from "@/components/VInput.vue";
import { computed, defineComponent, reactive, watch } from "vue";
import { minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { modalController } from "@ionic/vue";
import { useUserStore } from "@/store/user";
import { useListsStore } from "@/store/lists";
import { ActionType } from "@/models/store";
import { User } from "@/models/domain/user";
import { ListBuild } from "@/models/domain/list";
import VSpinner from "@/components/VSpinner.vue";

export default defineComponent({
  name: "DashBoardModalCreateList",
  components: {
    VSpinner,
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
    const listsStore = useListsStore();

    const state = reactive({
      name: "",
    });

    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(3) },
      };
    });

    const error = computed(() => {
      return listsStore.state.error;
    });

    const loading = computed(() => {
      return listsStore.state.loading;
    });

    async function presentAlert(header: string, message: string) {
      const alert = await alertController.create({
        header,
        message,
        buttons: ["OK"],
      });
      return alert.present();
    }

    watch(error, async error => {
      if (error) {
        await presentAlert("Ups...", error);
      }

      await listsStore.action(ActionType.lists.resetError);
    });

    const v$ = useVuelidate(rules, state);

    async function close() {
      await modalController.dismiss();
    }

    async function createList() {
      await v$.value.$validate();
      if (v$.value.$error) return;

      const newList = ListBuild.build(user.id as string, state.name as string);
      await listsStore.action(ActionType.lists.createList, newList);

      if (error.value) return;
      //TODO: REMOVE THIS IF LIST IS REACTIVE.
      await listsStore.action(ActionType.lists.fetchLists);
      await close();
    }

    return { state, v$, loading, createList, close };
  },
});
</script>
