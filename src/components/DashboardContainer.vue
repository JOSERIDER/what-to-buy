<template>
  <ion-header>
    <ion-toolbar>
      <ion-segment @ionChange="type = $event.detail.value" value="Private">
        <ion-segment-button value="Private">
          <ion-label>Private</ion-label>
        </ion-segment-button>
        <ion-segment-button value="Shared">
          <ion-label>Shared</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-button fill="clear" slot="end" color="primary">
        <ion-icon :icon="icons.shared" size="large"></ion-icon>
      </ion-button>
    </ion-toolbar>
  </ion-header>

  <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
    <ion-refresher-content
      :pulling-icon="icons.circleOutline"
      pulling-text="Pull to refresh"
      refreshing-spinner="circles"
      refreshing-text="Refreshing..."
    >
    </ion-refresher-content>
  </ion-refresher>

  <ion-modal :is-open="isModalOpen">
    <DashBoardModalCreateList :close="modalProps"></DashBoardModalCreateList>
  </ion-modal>

  <DashboardList
    @create-list="setOpen(true)"
    class="h-full"
    :list="list"
    :list-type="type"
  />
</template>

<script lang="ts">
import DashboardList from "@/components/DashboardList.vue";
import { usePrivateList, useSharedList } from "@/firebase";
import { useStore } from "@/store/store";

import {
  IonButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  IonModal,
} from "@ionic/vue";
import { shareOutline, chevronDownCircleOutline } from "ionicons/icons";
import { defineComponent, ref, watch } from "vue";
import { User } from "@/models/Users";
import DashBoardModalCreateList from "@/components/DashboardModalCreateList.vue";

export default defineComponent({
  name: "DashboardContainer",
  components: {
    DashBoardModalCreateList,
    DashboardList,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonSegment,
    IonLabel,
    IonSegmentButton,
    IonRefresher,
    IonRefresherContent,
    IonModal,
  },
  async setup() {
    const store = useStore();
    const list = ref([]);
    const type = ref("Private");
    const isModalOpen = ref(false);

    function fetchUser() {
      return store.getters.loggedUser;
    }

    const user: User = fetchUser() as User;

    async function fetchList(type: string, currentUser: User) {
      list.value =
        type === "Private"
          ? await usePrivateList(currentUser.privateList)
          : await useSharedList(currentUser.sharedList);
    }

    async function doRefresh(event: any) {
      await fetchList(type.value, user);
      event.target.complete();
    }

    const setOpen = (state: boolean) => (isModalOpen.value = state);
    const modalProps = { close: () => setOpen(false) };

    watch(type, async type => {
      await fetchList(type, user);
    });

    await fetchList(type.value, user);

    return {
      list,
      user,
      type,
      isModalOpen,
      doRefresh,
      modalProps,
      setOpen,
      icons: { shared: shareOutline, circleOutline: chevronDownCircleOutline },
    };
  },
});
</script>

<style scoped></style>
