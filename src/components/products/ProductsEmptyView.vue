<template>
  <div class="flex m-4 flex-col justify-center items-center">
    <ion-img
      :src="require('@/assets/resources/no-result.png')"
      class=""
      alt="Add new list"
    ></ion-img>
    <ion-text color="medium" class="mt-4 font-normal text-center">
      <h2>Sorry, no results for this search</h2>
    </ion-text>
  </div>
</template>

<script>
import { IonImg, IonText } from "@ionic/vue";

export default {
  components: {
    IonText,
    IonImg,
  },
  name: "ProductsEmptyView",
};
</script>

<style scoped></style>
