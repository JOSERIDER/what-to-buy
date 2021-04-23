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
    <VEmptyView v-if="list.length === 0" />
    <DashboardListItem
      v-else
      @delete-item="remove($event)"
      v-for="item in list"
      :key="item.listCode"
      :list="item"
    />
  </ion-list>
</template>

<script lang="ts">
import { IonList, IonListHeader, IonLabel, IonButton } from "@ionic/vue";
import { defineComponent } from "vue";
import DashboardListItem from "@/components/DashboardListItem.vue";
import VEmptyView from "@/components/VEmptyView.vue";
import { useListsStore } from "@/store/lists";
import { ActionType } from "@/models/store";

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
    VEmptyView,
    IonList,
    IonListHeader,
    IonLabel,
    IonButton,
  },
});
</script>
