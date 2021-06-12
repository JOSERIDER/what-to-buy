<template>
  <div class="m-1 shadow rounded h-24 h-full">
    <ion-item-sliding>
      <ion-item lines="none">
        <ion-thumbnail
          slot="start"
          class="p-1 w-16 h-16 flex justify-center items-center"
        >
          <ion-img class="rounded" :src="product.image" />
        </ion-thumbnail>
        <div class="flex flex-col w-full">
          <p class="font-bold">{{ product.name }}</p>
          <p class="font-light text-base text-blue-500">
            {{ product.price }} €
          </p>
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
      <ion-item-options side="end">
        <ion-item-option color="danger" @click="$emit('remove-item', product)">
          <ion-icon slot="icon-only" :icon="icons.trash" />
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </div>
</template>

<script lang="ts">
import {
  IonButton,
  IonImg,
  IonItem,
  IonThumbnail,
  IonIcon,
  IonButtons,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/vue";
import { removeCircleOutline, addCircleOutline, trash } from "ionicons/icons";
import { defineComponent, PropType } from "vue";
import { Product } from "@/models/domain/product";

export default defineComponent({
  name: "ListDetailItem",
  emits: ["increment-quantity", "decrement-quantity", "remove-item"],
  components: {
    IonItem,
    IonThumbnail,
    IonImg,
    IonButton,
    IonButtons,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
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
        trash,
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
