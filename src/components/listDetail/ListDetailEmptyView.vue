<template>
  <div class="empty ion-margin-horizontal">
    <ion-img :src="require('@/assets/resources/empty-cart.jpg')"></ion-img>
    <ion-label>Nothing here, try to add some product.</ion-label>
  </div>
</template>

<script>
import { IonImg, IonLabel } from "@ionic/vue";

export default {
  name: "ListDetailEmptyView",
  emits: ["add-product"],
  components: {
    IonImg,
    IonLabel,
  },
};
</script>

<style scoped></style>
