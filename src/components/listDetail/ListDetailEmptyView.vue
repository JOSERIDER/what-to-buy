<template>
  <div class="flex m-4 flex-col justify-center items-center">
    <ion-img
      :src="require('@/assets/resources/empty-cart.jpg')"
      class=""
      alt="Add new list"
    ></ion-img>
    <ion-text color="medium" class="mt-4 font-normal text-center">
      <h2>Nothing here, why don't you add a new product?</h2>
    </ion-text>
    <ion-button class="mt-5" @click="$emit('try-again')" color="light"
      >Add product</ion-button
    >
  </div>
</template>

<script>
import { IonImg, IonText } from "@ionic/vue";

export default {
  name: "ListDetailEmptyView",
  emits: ["add-product"],
  components: {
    IonImg,
    IonText,
  },
};
</script>

<style scoped></style>
