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

export default defineComponent({
  name: "DashboardPrivateList",
  async setup() {
    const listsStore = useListsStore();

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
      await listsStore.action(ActionType.lists.deleteList, listId);
      await listsStore.action(ActionType.lists.fetchLists);
    }

    function openList(item) {
      router.push({
        name: "ListDetail",
        params: { listId: item.listCode, listType: "Private" },
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
