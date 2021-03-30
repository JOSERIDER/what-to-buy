<template>
  <ion-content>
    <TheParticles/>
    <div class="content absolute_center">
      <div class="logoContainer">
        <img
          class="logo"
          :src="require('@/assets/resources/login-icon.png')"
          alt="login icon"
        />
      </div>
      <ion-slides mode="ios">
        <ion-slide>
          <AuthLogin />
        </ion-slide>
        <ion-slide>
          <AuthSignUp />
        </ion-slide>
      </ion-slides>
    </div>
  </ion-content>
</template>

<script lang="ts">
import AuthLogin from "@/components/AuthLogin.vue";
import AuthSignUp from "@/components/AuthSignUp.vue";
import { IonContent, IonSlides, IonSlide } from "@ionic/vue";
import TheParticles from "@/components/TheParticles.vue";

export default {
  components: {
    TheParticles,
    AuthLogin,
    AuthSignUp,
    IonContent,
    IonSlides,
    IonSlide,
  },
};
</script>

<style scoped>
ion-content {
  overflow-y: hidden;
}
ion-slides {
  height: calc(100% - 136px);
}

.logo {
  z-index: 999;
}
.content {
  height: 100%;
  background-size: cover;
  background: url("../assets/resources/login-background.svg") no-repeat fixed;
}
.content .logoContainer {
  display: flex;
  justify-content: center;
}

.content .logoContainer .logo {
  margin-top: 2.5rem;
  width: 6rem;
  height: 6rem;
}
</style>
