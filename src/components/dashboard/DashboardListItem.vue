<template>
  <ion-card class="my-4" :button="!editing">
    <div
      class="w-4 h-full absolute float-left"
      :style="{ background: list.color }"
    ></div>

    <ion-item lines="none" class="ml-4 bg-transparent">
      <div class="flex items-center w-full">
        <h2 class="w-2/3">{{ list.name }}</h2>

        <div
          v-if="editing && canBeDeleted"
          class="flex items-center w-1/3 justify-end"
        >
          <ion-buttons slot="end">
            <ion-button
              v-if="type === 'Private'"
              fill="clear"
              @click="$emit('edit-item', list)"
            >
              <ion-icon size="large" color="success" :icon="edit"></ion-icon>
            </ion-button>
            <ion-button
              fill="clear"
              class="ml-1 mr-1"
              @click="$emit('delete-item', list.listCode)"
            >
              <ion-icon
                size="large"
                color="danger"
                :icon="type === 'Shared' ? exit : trash"
              ></ion-icon>
            </ion-button>
          </ion-buttons>
        </div>
        <div v-else class="flex items-center w-1/3 justify-end">
          <ion-badge color="medium">
            {{ list.products.length >= 100 ? "99+" : list.products.length }}
          </ion-badge>
          <ion-icon :icon="arrow" class="ml-2 mr-1"></ion-icon>
        </div>
      </div>
    </ion-item>
  </ion-card>
</template>

<script lang="ts">
import { PropType } from "vue";
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
} from "@ionic/vue";
import {
  chevronForwardOutline,
  trashOutline,
  exitOutline,
  createOutline,
} from "ionicons/icons";
import { useListsStore } from "@/store/lists";
import { List } from "@/models/domain/list";

export default {
  name: "DashboardListItem",
  emits: ["delete-item", "view-list", "edit-item"],
  components: {
    IonCard,
    IonItem,
    IonIcon,
    IonBadge,
    IonButton,
    IonButtons,
  },
  data() {
    return {
      arrow: chevronForwardOutline,
      trash: trashOutline,
      exit: exitOutline,
      edit: createOutline,
    };
  },
  computed: {
    editing() {
      return useListsStore().state.editing;
    },
    type() {
      return useListsStore().state.type;
    },
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true,
    },
    canBeDeleted: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
