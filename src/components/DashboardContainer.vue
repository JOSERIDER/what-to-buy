<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-menu-button slot="start"> </ion-menu-button>
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
      @edit-list="editing = !editing"
      :list="list"
      :list-type="type"
    />
  </ion-content>
</template>

<script lang="ts">
import DashboardList from "@/components/DashboardList.vue";
import DashBoardModalCreateList from "@/components/DashboardModalCreateList.vue";
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
  modalController,
  IonContent,
  IonFab,
  IonFabButton,
  IonMenuButton,
  actionSheetController,
  toastController,
  alertController,
} from "@ionic/vue";
import { shareOutline, chevronDownCircleOutline, add } from "ionicons/icons";
import { defineComponent, ref, watch } from "vue";
import { User } from "@/models/Users";
import { SharedList } from "@/models/SharedList";
import { List } from "@/models/List";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import apiClient from "@/api-client";
import { useUserStore } from "@/store/user";

export default defineComponent({
  name: "DashboardContainer",
  components: {
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
    IonContent,
    IonFab,
    IonFabButton,
    IonMenuButton,
  },
  async setup() {
    const privateListApiClient = apiClient.privateLists;
    const sharedListApiClient = apiClient.sharedLists;

    const userStore = useUserStore();
    const list = ref([] as List[]);
    const type = ref("Private");
    const editing = ref(false);
    const isModalOpen = ref(false);
    const barcodeScanner: BarcodeScanner = new BarcodeScanner();

    function fetchUser() {
      return userStore.state.user;
    }

    const user: User = fetchUser() as User;

    function getPrivateList(currentUser: User): Promise<List[]> {
      return privateListApiClient.getUserList(currentUser.id as string);
    }

    function getSharedList(currentUser: User): Promise<SharedList[]> {
      return sharedListApiClient.getUserList(currentUser.id as string);
    }

    async function openModal() {
      const modal = await modalController.create({
        component: DashBoardModalCreateList,
      });
      await modal.present();
    }

    async function fetchList(type: string, currentUser: User) {
      list.value =
        type === "Private"
          ? await getPrivateList(currentUser)
          : await getSharedList(currentUser);
    }

    async function doRefresh(event: any) {
      await fetchList(type.value, user);
      event.target.complete();
    }

    function joinToList(resp: string) {
      sharedListApiClient
        .checkList(resp)
        .then(async () => {
          const added = await sharedListApiClient.addUser(
            resp,
            user.id as string
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

    watch(type, async type => {
      await fetchList(type, user);
    });

    watch(list, list => {
      if (list.length === 0) {
        editing.value = false;
      }
    });

    await fetchList(type.value, user);

    return {
      list,
      user,
      type,
      isModalOpen,
      editing,
      doRefresh,
      openModal,
      openJoinOptions,
      icons: {
        shared: shareOutline,
        circleOutline: chevronDownCircleOutline,
        add,
      },
    };
  },
});
</script>

<style scoped></style>
