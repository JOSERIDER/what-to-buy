<template>
  <div class="h-full w-full flex justify-center items-center flex-col p-4">
    <ion-img
      :src="require('@/assets/resources/slides/user.svg')"
      class="w-48 "
      alt="App icon"
    />
    <div class="text-xl text-center font-light mt-5">
      User sync
    </div>
    <span class="text-base font-extralight">
      Sync your shared list with your friends and family. Only their must scan
      your QR code and enjoy it!.
    </span>
  </div>
</template>

<script>
import { IonImg } from "@ionic/vue";

export default {
  name: "StarterSlide3",
  components: {
    IonImg,
  },
};
</script>

<style scoped></style>
