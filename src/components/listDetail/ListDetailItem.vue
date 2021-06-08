<template>
  <ion-item lines="none" class="m-1 shadow rounded h-24">
    <ion-thumbnail
      slot="start"
      class="p-1 w-16 h-16 flex justify-center items-center"
    >
      <ion-img class="rounded" :src="product.image" />
    </ion-thumbnail>
    <div class="flex flex-col w-full">
      <p class="font-bold">{{ product.name }}</p>
      <p class="font-light text-base text-blue-500">{{ product.price }} €</p>
      <div class="flex w-full justify-center flex-row items-start">
        <ion-buttons class="space-x-5">
          <ion-button
            fill="clear"
            @click="$emit('decrement-quantity', product)"
            color="dark"
          >
            <ion-icon size="large" :icon="icons.remove"></ion-icon>
          </ion-button>
          <ion-button
            fill="clear"
            @click="$emit('increment-quantity', product)"
            color="primary"
          >
            <ion-icon size="large" :icon="icons.add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </div>
      <div class="price absolute right-4 font-bold text-2xl">
        {{ product.quantity }}
      </div>
    </div>
  </ion-item>
</template>

<script lang="ts">
import {
  IonButton,
  IonImg,
  IonItem,
  IonThumbnail,
  IonIcon,
  IonButtons,
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
    IonButtons,
    IonIcon,
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

<style scoped>
.price {
  top: 33px;
  color: #ffc409;
}
</style>
