<template>
  <ion-list>
    <ion-list-header>
      <ion-label>My shared list</ion-label>
      <ion-button @click="openJoinOptions">
        Join to other list
      </ion-button>
    </ion-list-header>

    <!-- User owned list -->
    <DashboardListItem
      v-if="userListOwned"
      @delete-item="unJoin($event)"
      @click="!editing ? openList(userListOwned) : ''"
      :list="userListOwned"
      :can-be-deleted="false"
    />

    <!-- User list belong -->
    <div v-if="userListBelong.length > 0">
      <ion-list-header>
        <ion-label>Shared lists</ion-label>
        <ion-button @click="edit">
          {{ editing ? "Done" : "Edit" }}
        </ion-button>
      </ion-list-header>
      <DashboardListItem
        @delete-item="unJoin($event)"
        @click="!editing ? openList(list) : ''"
        v-for="list in userListBelong"
        :key="list.listCode"
        :list="list"
      />
    </div>
  </ion-list>
</template>

<script lang="ts">
import { IonList, IonListHeader, IonLabel, IonButton } from "@ionic/vue";
import { computed, defineComponent, watch } from "vue";
import DashboardListItem from "@/components/dashboard/DashboardListItem.vue";
import { useListsStore } from "@/store/lists";
import { ActionType } from "@/models/store";
import router from "@/router";
import apiClient from "@/api-client";
import { useUserStore } from "@/store/user";
import useScanner from "@/use/useScanner";
import useIonicService from "@/use/useIonicService";
import { SharedList } from "@/models/domain/sharedList";

export default defineComponent({
  name: "DashboardSharedList",
  components: {
    DashboardListItem,
    IonList,
    IonListHeader,
    IonLabel,
    IonButton,
  },
  setup() {
    const listsStore = useListsStore();
    const userStore = useUserStore();
    const { actionSheet, alert, toast } = useIonicService();

    const editing = computed(() => {
      return listsStore.state.editing;
    });

    const lists = computed(() => {
      return listsStore.state.lists as SharedList[];
    });

    const user = computed(() => {
      return userStore.state.user;
    });

    const userListOwned = computed(() => {
      return lists.value.find(list => list.admin === user.value?.id);
    });

    const userListBelong = computed(() => {
      return lists.value.filter(list => list.admin !== user.value?.id);
    });

    function edit() {
      listsStore.action(ActionType.lists.editLists);
    }

    function joinToList(resp: string) {
      apiClient.sharedLists
        .checkList(resp)
        .then(async () => {
          const added = await apiClient.sharedLists.addUser(
            resp,
            user.value.id as string
          );
          await listsStore.action(ActionType.lists.fetchLists);
          if (!added) {
            await toast({
              message: "You already belong to this list.",
              duration: 2000,
            });
            return;
          }
        })
        .catch(async () => {
          await toast({
            message: "This list or user not exists.",
            duration: 2000,
          });
        });
    }

    function openScanner() {
      useScanner(resp => joinToList(resp));
    }

    async function insertCode() {
      await alert({
        header: "Insert list code",
        message: "",
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
    }

    async function openJoinOptions() {
      await actionSheet({
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
    }

    async function unJoin(listId) {
      await listsStore.action(ActionType.lists.unJoinList, listId);
      await listsStore.action(ActionType.lists.fetchLists);
    }

    function openList(item) {
      router.push({
        name: "ListDetail",
        params: { listId: item.listCode, listType: "shared" },
      });
    }

    //If the lists become to be empty editing will be false.
    watch(userListBelong, lists => {
      if (lists.length === 0 && editing.value) {
        listsStore.action(ActionType.lists.editLists);
      }
    });

    return {
      editing,
      userListOwned,
      userListBelong,
      openJoinOptions,
      edit,
      unJoin,
      openList,
    };
  },
});
</script>
