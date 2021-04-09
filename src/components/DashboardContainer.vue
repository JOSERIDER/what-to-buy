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

  <ion-content class="ion-padding">
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
      class="mb-16"
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
      @edit-list="editing = !editing"
      :list="list"
      :private-repository="privateListRepository"
      :shared-repository="sharedListRepository"
      :list-type="type"
    />
  </ion-content>
</template>

<script lang="ts">
import DashboardList from "@/components/DashboardList.vue";
import DashBoardModalCreateList from "@/components/DashboardModalCreateList.vue";
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
  modalController,
  IonContent,
  IonFab,
  IonFabButton,
} from "@ionic/vue";
import { shareOutline, chevronDownCircleOutline, add } from "ionicons/icons";
import { defineComponent, ref, watch } from "vue";
import { User } from "@/models/Users";
import { repositories, repositoryTypes } from "@/repository/RepositoryFactory";
import { SharedList } from "@/models/SharedList";
import { List } from "@/models/List";

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
  },
  async setup() {
    const privateListRepository =
      repositories[repositoryTypes.PRIVATE_LIST_REPOSITORY];
    const sharedListRepository =
      repositories[repositoryTypes.SHARED_LIST_REPOSITORY];

    const store = useStore();
    const list = ref([] as List[]);
    const type = ref("Private");
    const editing = ref(false);
    const isModalOpen = ref(false);

    function fetchUser() {
      return store.getters.loggedUser;
    }

    const user: User = fetchUser() as User;

    function getPrivateList(currentUser: User): Promise<List[]> {
      return privateListRepository.getUserList(currentUser.id);
    }

    function getSharedList(currentUser: User): Promise<SharedList[]> {
      return sharedListRepository.getUserList(currentUser.id);
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
      privateListRepository,
      sharedListRepository,
      doRefresh,
      openModal,
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
