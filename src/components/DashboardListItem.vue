<template>
  <ion-card class="my-4" :button="!editing">
    <div
      class="w-4 h-full absolute float-left"
      :style="{ background: list.color }"
    ></div>

    <ion-item lines="none" class="ml-4 bg-transparent">
      <div class="flex items-center w-full">
        <h2 class="w-2/3">{{ list.name }}</h2>

        <div v-if="editing" class="flex items-center w-1/3 justify-end">
          <ion-button
            fill="clear"
            slot="end"
            @click="$emit('delete-item', list.listCode)"
          >
            <ion-icon
              size="large"
              color="danger"
              :icon="trash"
              class="ml-2 mr-1"
            ></ion-icon>
          </ion-button>
        </div>
        <div v-else class="flex items-center w-1/3 justify-end">
          <ion-badge color="medium">{{
            list.products.length >= 100 ? "99+" : list.products.length
          }}</ion-badge>
          <ion-icon :icon="arrow" class="ml-2 mr-1"></ion-icon>
        </div>
      </div>
    </ion-item>
  </ion-card>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IonBadge, IonButton, IonCard, IonIcon, IonItem } from "@ionic/vue";
import { chevronForwardOutline, trashOutline } from "ionicons/icons";
import { List } from "@/models/List";
import { useListsStore } from "@/store/lists";
export default {
  name: "DashboardListItem",
  emits: ["delete-item", "view-list"],
  components: {
    IonCard,
    IonItem,
    IonIcon,
    IonBadge,
    IonButton,
  },
  data() {
    return {
      arrow: chevronForwardOutline,
      trash: trashOutline,
    };
  },
  computed: {
    editing() {
      return useListsStore().state.editing;
    },
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true,
    },
  },
};
</script>
