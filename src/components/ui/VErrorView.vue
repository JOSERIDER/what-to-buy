<template>
  <div class="flex m-4 flex-col justify-center items-center">
    <ion-img
      :src="require('@/assets/resources/error-view.svg')"
      class="w-16 h-16"
      alt="Add new list"
    ></ion-img>
    <ion-text color="medium" class="mt-4 font-normal text-center">
      <h2>{{ message }}</h2>
    </ion-text>
    <ion-button class="mt-5" @click="$emit('try-again')" color="light"
      >Try again</ion-button
    >
  </div>
</template>
<script lang="ts">
import { IonButton, IonImg, IonText } from "@ionic/vue";

export default {
  name: "VEmptyView",
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  components: {
    IonImg,
    IonText,
    IonButton,
  },
};
</script>
