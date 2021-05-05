<template>
  <ion-list>
    <ion-list-header>
      <ion-label>{{ listType }} list </ion-label>
      <ion-button
        v-if="listType === 'Private' && list.length > 0"
        @click="edit()"
        >{{ editing ? "Done" : "Edit" }}</ion-button
      >
      <ion-button
        v-if="list.length > 0 && listType === 'Shared'"
        @click="$emit('join-list')"
        >Join to other list</ion-button
      >
    </ion-list-header>

    <div v-if="list.length > 0">
      <DashboardListItem
        @delete-item="remove($event)"
        @click="!editing ? openList(item) : ''"
        v-for="item in list"
        :key="item.listCode"
        :list="item"
      />
    </div>
  </ion-list>
</template>

<script lang="ts">
import { IonList, IonListHeader, IonLabel, IonButton } from "@ionic/vue";
import { defineComponent } from "vue";
import DashboardListItem from "@/components/dashboard/DashboardListItem.vue";
import { useListsStore } from "@/store/lists";
import { ActionType } from "@/models/store";
import { List } from "@/models/domain/list";

export default defineComponent({
  name: "DashboardList",
  emits: ["create-list", "join-list", "edit-list"],
  props: {
    listType: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
  },
  methods: {
    edit() {
      this.listsStore.action(ActionType.lists.editLists);
    },
    async remove(listId) {
      await this.listsStore.action(ActionType.lists.deleteList, listId);
      //TODO: REMOVE THIS IF LIST IS REACTIVE.
      await this.listsStore.action(ActionType.lists.fetchLists);
    },
    openList(item: List) {
      this.$router.push({
        name: "ListDetail",
        params: { listId: item.listCode, listType: this.listType },
      });
    },
  },
  computed: {
    listsStore() {
      return useListsStore();
    },
    editing() {
      return useListsStore().state.editing;
    },
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
