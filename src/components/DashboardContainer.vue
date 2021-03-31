<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start"> </ion-buttons>
      <ion-title>list of {{ user.name }}</ion-title>
      <ion-button fill="clear" slot="end" color="primary">
        <ion-icon icon="share-outline" size="large"></ion-icon>
      </ion-button>
    </ion-toolbar>
  </ion-header>

  <DashboardList :list="privateList" list-type="private" />
  <!-- TODO EDIT BUTTON -->
  <DashboardList :list="sharedList" list-type="shared" />
</template>

<script lang="ts">
import DashboardList from "@/components/DashboardList.vue";
import { usePrivateList, useSharedList } from "@/firebase";
import { useStore } from "@/store/store";

import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle,
  IonIcon,
  IonButtons,
} from "@ionic/vue";
import { ActionTypes } from "@/store/action-types";

export default {
  name: "DashboardContainer",
  components: {
    DashboardList,
    IonHeader,
    IonToolbar,
    IonButton,
    IonTitle,
    IonIcon,
    IonButtons,
  },
  async setup() {
    const store = useStore();
    const user = await store.dispatch(ActionTypes.GET_USER);

    const privateList = usePrivateList(user.privateList);
    const sharedList = useSharedList(user.sharedList);

    return { privateList, sharedList, user };
  },
};
</script>

<style scoped></style>
