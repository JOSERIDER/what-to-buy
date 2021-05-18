<template>
  <ion-item>
    <ion-thumbnail slot="start">
      <img :src="product.image" :alt="product.name" />
    </ion-thumbnail>
    <div class="grid w-full grid-rows-2 grid-cols-2">
      <ion-label class="row-start-1">{{ product.name }}</ion-label>
      <p class="row-start-2 row-end-2">
        {{ product.category }}
      </p>
      <div
        class="flex justify-end items-center row-span-3 row-start-1 row-end-2 col-start-2 col-end-2 items-center"
      >
        <p class="text-2xl text-blue-500">{{ product.price }} €</p>
      </div>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonThumbnail } from "@ionic/vue";
import { defineComponent, PropType } from "vue";
import { Product } from "@/models/domain/product";

export default defineComponent({
  name: "ProductItem",
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  components: {
    IonItem,
    IonThumbnail,
    IonLabel,
  },
});
</script>

<style scoped></style>
