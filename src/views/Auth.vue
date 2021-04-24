<template>
  <ion-content class="overflow-y-hidden">
    <TheParticles />
    <div class="h-full bg-cover content">
      <div class=" flex justify-center">
        <img
          class="z-50 mt-10 w-24 h-25"
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
import { IonContent, IonSlides, IonSlide, alertController } from "@ionic/vue";
import TheParticles from "@/components/TheParticles.vue";
import { computed, watch } from "vue";
import { ActionType } from "@/models/store";
import { useAuthsStore } from "@/store/auth";

export default {
  components: {
    TheParticles,
    AuthLogin,
    AuthSignUp,
    IonContent,
    IonSlides,
    IonSlide,
  },
  setup() {
    const authStore = useAuthsStore();

    const authError = computed(() => {
      return authStore.state.error;
    });

    async function presentAlert(header: string, message: string) {
      const alert = await alertController.create({
        header,
        message,
        buttons: ["OK"],
      });
      return alert.present();
    }

    watch(authError, async error => {
      if (error) {
        await presentAlert("Something is wrong", error);
      }

      await authStore.action(ActionType.auth.resetError);
    });
  },
};
</script>

<style scoped>
ion-slides {
  height: calc(100% - 136px);
}

.content {
  background: url("../assets/resources/login-background.svg") no-repeat fixed;
}
</style>
