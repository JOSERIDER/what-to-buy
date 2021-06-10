<template>
  <ion-content>
    <ion-slides pager="true" class="h-full">
      <!-- Slide 1-->
      <ion-slide class="step-one">
        <StarterSlide1 />
      </ion-slide>
      <!-- Slide 2-->
      <ion-slide class="step-two">
        <StarterSlide2 />
      </ion-slide>

      <!-- Slide 3-->
      <ion-slide class="step-three">
        <StarterSlide3 />
      </ion-slide>

      <ion-slide class="step-three">
        <StarterSlide4 @continue="start" />
      </ion-slide>
    </ion-slides>
  </ion-content>
</template>

<script>
import { IonContent, IonSlide, IonSlides } from "@ionic/vue";
import StarterSlide1 from "@/components/starter-slide/StarterSlide1";
import StarterSlide2 from "@/components/starter-slide/StarterSlide2";
import StarterSlide3 from "@/components/starter-slide/StarterSlide3";
import StarterSlide4 from "@/components/starter-slide/StarterSlide4";
import storageClient from "@/storage-client";

export default {
  name: "Starter",
  components: {
    StarterSlide4,
    StarterSlide3,
    StarterSlide2,
    StarterSlide1,
    IonContent,
    IonSlides,
    IonSlide,
  },
  methods: {
    async start() {
      await storageClient.starter.set(true);
      await this.$router.push("/");
    },
  },
};
</script>
