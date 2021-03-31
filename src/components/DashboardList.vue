<template>
  <ion-list>
    <ion-list-header>
      <ion-label>{{ listType }} list </ion-label>
      <ion-button @click="$emit('create-list', listType)"
        >Create new list</ion-button
      >
    </ion-list-header>
    <div
      class="flex m-4 flex-col justify-center content-center"
      v-if="list.length === 0"
    >
      <div>
        <h1>Start adding a new list</h1>
        <ion-img
          class="w-16 mr-3"
          :src="require('@/assets/resources/arrow-up.png')"
        ></ion-img>
      </div>
    </div>
    <DashboardListItem
      v-else
      v-for="item in list"
      :key="item.listCode"
      :list="item"
    />
  </ion-list>
</template>

<script lang="ts">
import {
  IonList,
  IonListHeader,
  IonLabel,
  IonButton,
  IonImg,
} from "@ionic/vue";
import { defineComponent } from "vue";
import DashboardListItem from "@/components/DashboardListItem.vue";

export default defineComponent({
  name: "DashboardList",
  emits: ["create-list"],
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
    DashboardListItem,
    IonList,
    IonListHeader,
    IonLabel,
    IonButton,
    IonImg,
  },
});
</script>
