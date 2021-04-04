<template>
  <div class="flex m-4 h-full flex-col justify-center items-center">
    <ion-img
      :src="require('@/assets/resources/dashboard-add-list.svg')"
      class="w-16 h-16"
      alt="Add new list"
    ></ion-img>
    <ion-text color="primary" class="mt-4 font-normal">
      <h2>No private lists yet</h2>
    </ion-text>
  </div>
</template>
<script lang="ts">
import { IonImg, IonText } from "@ionic/vue";

export default {
  name: "VEmptyView",
  components: {
    IonImg,
    IonText,
  },
};
</script>
