<template>
  <ion-list>
    <ion-list-header>
      <ion-label>{{ listType }} list </ion-label>
      <ion-button
        v-if="listType === 'Private' && list.length > 0"
        @click="edit()"
        >{{ deleting ? "Editing" : "Edit" }}</ion-button
      >
      <ion-button
        v-if="listType === 'Shared' && list.length > 0"
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
      :deleting="deleting"
    />
  </ion-list>
</template>

<script lang="ts">
import { IonList, IonListHeader, IonLabel, IonButton } from "@ionic/vue";
import { defineComponent } from "vue";
import DashboardListItem from "@/components/DashboardListItem.vue";
import VEmptyView from "@/components/VEmptyView.vue";
import apiClient from "@/api-client";

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
      this.deleting = !this.deleting;
      this.$emit("edit-list");
    },
    remove(listId) {
      if (this.listType === "Private") {
        apiClient.privateLists.delete(listId);
      } else {
        apiClient.sharedLists.delete(listId);
      }
    },
  },
  data() {
    return {
      deleting: false,
    };
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
