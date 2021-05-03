<template>
  <ion-item>
    <ion-thumbnail>
      <ion-img :src="product.image" />
    </ion-thumbnail>

    <ion-button
      fill="clear"
      class=""
      @click="$emit('increment-quantity', product)"
      color="dark"
    >
      <ion-icon size="large" :icon="icons.add"></ion-icon>
    </ion-button>
    <ion-label class="ion-text-center name">
      {{ product.name }}
    </ion-label>
    <ion-button
      fill="clear"
      class="flex items-center float-right"
      @click="$emit('decrement-quantity', product)"
      color="dark"
    >
      <ion-icon size="large" :icon="icons.remove"></ion-icon>
    </ion-button>
    <ion-badge color="primary" mode="ios">{{ product.quantity }}</ion-badge>
  </ion-item>
</template>

<script lang="ts">
import {
  IonButton,
  IonImg,
  IonItem,
  IonThumbnail,
  IonIcon,
  IonLabel,
  IonBadge,
} from "@ionic/vue";
import { removeCircleOutline, addCircleOutline } from "ionicons/icons";
import { defineComponent, PropType } from "vue";
import { Product } from "@/models/domain/product";

export default defineComponent({
  name: "ListDetailItem",
  emits: ["increment-quantity", "decrement-quantity"],
  components: {
    IonItem,
    IonThumbnail,
    IonImg,
    IonButton,
    IonIcon,
    IonLabel,
    IonBadge,
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  data() {
    return {
      icons: {
        remove: removeCircleOutline,
        add: addCircleOutline,
      },
    };
  },
});
</script>

<style scoped></style>
