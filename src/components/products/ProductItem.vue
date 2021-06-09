<template>
  <ion-item lines="none" detail class="element m-1 shadow rounded">
    <ion-thumbnail
      slot="start"
      class="p-1 w-16 h-16 flex justify-start items-center"
    >
      <img :src="product.image" width="64" height="64" :alt="product.name" />
    </ion-thumbnail>

    <div class="flex flex-col h-20 w-full">
      <p
        :class="[product.name.length > 10 ? 'text-sm' : 'text-lg']"
        class="font-bold"
      >
        {{ product.name }}
      </p>
      <p class="font-light text-base text-blue-500">{{ product.price }} €</p>
      <p class="font-extralight text-sm">
        {{ product.category }}
      </p>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonThumbnail } from "@ionic/vue";
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
  },
});
</script>

<style scoped>
.element:active {
  @apply shadow-inner;
}
</style>
