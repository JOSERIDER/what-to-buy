<template>
  <ion-card class="my-4" button="true">
    <ion-label
      :class="{ 'background-color': list.color }"
      class="w-20 h-full absolute float-left"
    ></ion-label>

    <ion-item class="bg-opacity-0" lines="none">
      <ion-button
        v-if="deleting"
        slot="start"
        expand="block"
        fill="clear"
        @click="$emit('remove-list', { type: 'private', list })"
      >
        <ion-icon color="danger" :icon="`trash`"></ion-icon>
      </ion-button>
      <ion-label
        class="w-40 mt-0 mb-auto"
        @click="$emit('view-list', { type: 'private', list })"
      >
        <h2 class="flex items-center float-left">{{ list.name }}</h2>
        <ion-icon
          class="flex items-center float-right"
          :icon="`chevron-forward-outline`"
        ></ion-icon>
        <h2 class="flex items-center float-right">
          {{ list.products.length }}
        </h2>
      </ion-label>
    </ion-item>
  </ion-card>
</template>

<script lang="ts">
import { IonCard, IonLabel, IonItem, IonButton, IonIcon } from "@ionic/vue";

export default {
  name: "DashboardListItem",
  emits: ["remove-list", "view-list"],
  components: {
    IonCard,
    IonLabel,
    IonItem,
    IonButton,
    IonIcon,
  },
  props: {
    list: {
      required: true,
    },
    deleting: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
