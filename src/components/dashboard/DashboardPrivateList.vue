<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Private list</ion-label>
      <ion-button v-if="lists.length > 0" @click="edit()">
        {{ editing ? "Done" : "Edit" }}
      </ion-button>
    </ion-list-header>

    <div v-if="lists.length > 0">
      <DashboardListItem
        @delete-item="remove($event)"
        @edit-item="openEditAlert($event)"
        @click="!editing ? openList(item) : ''"
        v-for="item in lists"
        :key="item.listCode"
        :list="item"
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
import useIonicService from "@/use/useIonicService";
import { List } from "@/models/domain/list";

export default defineComponent({
  name: "DashboardPrivateList",
  async setup() {
    const listsStore = useListsStore();
    const { alert } = useIonicService();

    const editing = computed(() => {
      return listsStore.state.editing;
    });

    const lists = computed(() => {
      return listsStore.state.lists;
    });

    function edit() {
      listsStore.action(ActionType.lists.editLists);
    }

    async function remove(listId) {
      await alert({
        header: "Delete list",
        message:
          "Your list will be deleted without rollback option. Are you sure ?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Continue",
            handler: async () => {
              await listsStore.action(ActionType.lists.deleteList, listId);
              await listsStore.action(ActionType.lists.fetchLists);
            },
          },
        ],
        inputs: [],
      });
    }

    function openList(item) {
      router.push({
        name: "ListDetail",
        params: { listId: item.listCode, listType: "Private" },
      });
    }
    async function editItem(item: List, name: string) {
      const listItem = { ...item };

      listItem.name = name;
      await listsStore.action(ActionType.lists.updateList, {
        listId: item.listCode,
        listItem,
      });
      await listsStore.action(ActionType.lists.fetchLists);
    }

    function openEditAlert(item) {
      alert({
        header: "Edit your list",
        message: "Here you can change your list name",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => close(),
          },
          {
            text: "Save",
            handler: val => {
              if (val.listName === "") {
                return;
              }
              editItem(item, val.listName);
            },
          },
        ],
        inputs: [
          {
            name: "listName",
            value: item.name,
            type: "text",
            placeholder: "List name",
          },
        ],
      });
    }

    //If the lists become to be empty editing will be false.
    watch(lists, lists => {
      if (lists.length === 0) {
        listsStore.action(ActionType.lists.editLists);
      }
    });

    return {
      lists,
      editing,
      edit,
      openEditAlert,
      remove,
      openList,
    };
  },
  components: {
    DashboardListItem,
    IonList,
    IonListHeader,
    IonLabel,
    IonButton,
  },
});
</script>
