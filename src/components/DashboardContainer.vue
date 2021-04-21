<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-menu-button slot="start"> </ion-menu-button>
      <ion-segment @ionChange="changeType($event.detail.value)" value="Private">
        <ion-segment-button value="Private">
          <ion-label>Private</ion-label>
        </ion-segment-button>
        <ion-segment-button value="Shared">
          <ion-label>Shared</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>

  <ion-content :fullscreen="true">
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content
        :pulling-icon="icons.circleOutline"
        pulling-text="Pull to refresh"
        refreshing-spinner="circles"
        refreshing-text="Refreshing..."
      >
      </ion-refresher-content>
    </ion-refresher>
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
    <DashboardList
      @create-list="openModal()"
      @join-list="openJoinOptions()"
      :list="lists"
      :list-type="type"
    />
  </ion-content>
</template>

<script lang="ts">
import DashboardList from "@/components/DashboardList.vue";
import DashBoardModalCreateList from "@/components/DashboardModalCreateList.vue";
import {
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  modalController,
  IonContent,
  IonFab,
  IonFabButton,
  IonMenuButton,
  actionSheetController,
  toastController,
  alertController,
} from "@ionic/vue";
import { chevronDownCircleOutline, add } from "ionicons/icons";
import { computed, defineComponent, ref, watch } from "vue";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { useUserStore } from "@/store/user";
import { useListsStore } from "@/store/lists";
import { ActionType } from "@/models/store";
import apiClient from "@/api-client";

export default defineComponent({
  name: "DashboardContainer",
  components: {
    DashboardList,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonSegment,
    IonLabel,
    IonSegmentButton,
    IonRefresher,
    IonRefresherContent,
    IonContent,
    IonFab,
    IonFabButton,
    IonMenuButton,
  },
  async setup() {
    const listsStore = useListsStore();
    const userStore = useUserStore();
    const isModalOpen = ref(false);
    const barcodeScanner: BarcodeScanner = new BarcodeScanner();

    const user = computed(() => {
      return userStore.state.user;
    });

    const type = computed(() => {
      return listsStore.state.type;
    });

    const lists = computed(() => {
      return listsStore.state.lists;
    });

    const editing = computed(() => {
      return listsStore.state.editing;
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

    function fetchList() {
      listsStore.action(ActionType.lists.fetchLists);
    }

    async function doRefresh(event: any) {
      await fetchList();
      event.target.complete();
    }

    function joinToList(resp: string) {
      apiClient.sharedLists
        .checkList(resp)
        .then(async () => {
          const added = await apiClient.sharedLists.addUser(
            resp,
            user.value.id as string
          );
          if (!added) {
            const toast = await toastController.create({
              message: "You already belong to this list.",
              duration: 2000,
            });
            await toast.present();
            return;
          }
        })
        .catch(async () => {
          const toast = await toastController.create({
            message: "This list or user not exists.",
            duration: 2000,
          });
          await toast.present();
          console.log("list doesn't exists");
        });
    }

    function openScanner() {
      barcodeScanner
        .scan()
        .then(resp => joinToList(resp.text))
        .catch(async () => {
          const toast = await toastController.create({
            message: "Scanner no available.",
            duration: 2000,
          });
          await toast.present();
        });
    }

    async function insertCode() {
      const alert = await alertController.create({
        header: "Insert list code",
        inputs: [
          {
            name: "listCode",
            id: "listCode",
            placeholder: "List code",
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Confirm Cancel");
            },
          },
          {
            text: "Join",
            handler: data => joinToList(data.listCode),
          },
        ],
      });
      return alert.present();
    }

    async function openJoinOptions() {
      const actionSheet = await actionSheetController.create({
        header: "Join to list",
        buttons: [
          {
            text: "Scan QR",
            handler: () => openScanner(),
          },
          {
            text: "Insert list code",
            handler: () => insertCode(),
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      });
      await actionSheet.present();
    }

    watch(lists, lists => {
      if (lists.length === 0) {
        listsStore.action(ActionType.lists.editLists);
      }
    });

    await fetchList();

    return {
      lists,
      type,
      isModalOpen,
      editing,
      doRefresh,
      openModal,
      openJoinOptions,
      changeType,
      icons: {
        circleOutline: chevronDownCircleOutline,
        add,
      },
    };
  },
});
</script>

<style scoped></style>
