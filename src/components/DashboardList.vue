<template>
  <ion-list>
    <ion-list-header>
      <ion-label>{{ listType }} list </ion-label>
      <ion-button v-if="listType === 'Private'" @click="$emit('create-list')"
        >Create new list</ion-button
      >
      <ion-button v-if="listType === 'Shared'" @click="$emit('join-list')"
        >Join to other list</ion-button
      >
    </ion-list-header>
    <VEmptyView
      @click="$emit('create-list', listType)"
      v-if="list.length === 0"
    />
    <DashboardListItem
      v-else
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

export default defineComponent({
  name: "DashboardList",
  emits: ["create-list", "join-list"],
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
  components: {
    VEmptyView,
    DashboardListItem,
    IonList,
    IonListHeader,
    IonLabel,
    IonButton,
  },
});
</script>
