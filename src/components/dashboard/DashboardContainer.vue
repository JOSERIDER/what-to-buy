<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-menu-button slot="start"> </ion-menu-button>
      <ion-segment @ionChange="changeType($event.detail.value)" :value="type">
        <ion-segment-button value="Private">
          <ion-label>Private</ion-label>
        </ion-segment-button>
        <ion-segment-button value="Shared">
          <ion-label>Shared</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <VRefresher
      v-if="!isListEmpty"
      @do-refresh="doRefresh($event)"
      :icons="icons"
    />
    <div v-if="!isListEmpty">
      <DashboardPrivateList v-if="type === 'Private'" />
      <DashboardSharedList v-else-if="type === 'Shared'" />
    </div>

    <div
      v-else-if="listsError || loading || isListEmpty"
      class="flex flex-row items-center h-full justify-center"
    >
      <VErrorView
        @try-again="fetchList"
        v-if="listsError"
        :message="listsError"
      />

      <VSpinner v-else-if="isListEmpty && loading" />
      <VEmptyView class="text-center" v-else-if="isListEmpty && !loading" />
    </div>

    <ion-fab
      v-if="!editing && type === 'Private'"
      class="mb-14"
      vertical="bottom"
      slot="fixed"
      horizontal="end"
      @click="openModal()"
    >
      <ion-fab-button>
        <ion-icon :icon="icons.add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>

<script lang="ts">
import DashboardPrivateList from "@/components/dashboard/DashboardPrivateList.vue";
import DashBoardModalCreateList from "@/components/dashboard/DashboardModalCreateList.vue";
import VEmptyView from "@/components/ui/VEmptyView.vue";
import VSpinner from "@/components/ui/VSpinner.vue";
import VRefresher from "@/components/ui/VRefresher.vue";
import VErrorView from "@/components/ui/VErrorView.vue";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  modalController,
} from "@ionic/vue";

import { add, chevronDownCircleOutline } from "ionicons/icons";
import { computed, defineComponent, ref } from "vue";
import { useListsStore } from "@/store/lists";
import { ActionType } from "@/models/store";
import DashboardSharedList from "@/components/dashboard/DashboardSharedList.vue";

export default defineComponent({
  name: "DashboardContainer",
  components: {
    DashboardSharedList,
    VRefresher,
    VSpinner,
    DashboardPrivateList,
    VEmptyView,
    VErrorView,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonSegment,
    IonLabel,
    IonSegmentButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonMenuButton,
  },
  setup() {
    const listsStore = useListsStore();
    const isModalOpen = ref(false);

    const type = computed(() => {
      return listsStore.state.type;
    });

    const loading = computed(() => {
      return listsStore.state.loading;
    });

    const isListEmpty = computed(() => {
      return listsStore.state.lists.length === 0;
    });

    const editing = computed(() => {
      return listsStore.state.editing;
    });

    const listsError = computed(() => {
      return listsStore.state.error;
    });

    async function openModal() {
      const modal = await modalController.create({
        component: DashBoardModalCreateList,
      });
      await modal.present();
    }

    function changeType(type) {
      listsStore.action(ActionType.lists.changeType, type);
      listsStore.action(ActionType.lists.fetchLists);
      if (editing.value) {
        listsStore.action(ActionType.lists.editLists);
      }
    }

    async function fetchList() {
      await listsStore.action(ActionType.lists.fetchLists);
    }

    async function doRefresh(event: any) {
      await fetchList();
      event.target.complete();
    }

    fetchList();

    return {
      type,
      isModalOpen,
      editing,
      loading,
      isListEmpty,
      listsError,
      doRefresh,
      openModal,
      changeType,
      fetchList,
      icons: {
        circleOutline: chevronDownCircleOutline,
        add,
      },
    };
  },
});
</script>
