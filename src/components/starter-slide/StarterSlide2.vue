<template>
  <div class="h-full w-full flex justify-center items-center flex-col p-4">
    <ion-img
      :src="require('@/assets/resources/slides/cloud.svg')"
      class="w-48 "
      alt="App icon"
    />
    <div class="text-xl text-center font-light mt-5">
      Cloud storage
    </div>
    <span class="text-base font-extralight">
      All your lists and products synchronized between all your devices, with
      maximum <span class="font-bold">security</span> and
      <span class="font-bold">privacy</span>.
    </span>
  </div>
</template>

<script>
import { IonImg } from "@ionic/vue";

export default {
  name: "StarterSlide2",
  components: {
    IonImg,
  },
};
</script>

<style scoped></style>
