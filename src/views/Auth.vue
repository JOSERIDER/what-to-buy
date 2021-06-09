<template>
  <ion-page>
    <ion-content>
      <div class="h-full w-full content overflow-y-scroll">
        <div class=" flex justify-center">
          <img
            class="z-50 mt-10 w-60 "
            :src="require('@/assets/resources/wtb-logo_large.png')"
            alt="login icon"
          />
        </div>
        <component @change-component="changeComponent" :is="componentNames" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import AuthLogin from "@/components/auth/AuthLogin.vue";
import AuthSignUp from "@/components/auth/AuthSignUp.vue";
import { IonContent, alertController, IonPage } from "@ionic/vue";
import { computed, ref, watch } from "vue";
import { ActionType } from "@/models/store";
import { useAuthsStore } from "@/store/auth";

export default {
  components: {
    AuthLogin,
    AuthSignUp,
    IonContent,
    IonPage,
  },
  setup() {
    const authStore = useAuthsStore();
    const particlesKey = ref(0);
    const authError = computed(() => {
      return authStore.state.error;
    });
    const componentNames = ref("AuthLogin");

    async function presentAlert(header: string, message: string) {
      const alert = await alertController.create({
        header,
        message,
        buttons: ["OK"],
      });
      return alert.present();
    }

    function changeComponent(event) {
      componentNames.value = event;
    }

    watch(authError, async error => {
      if (error) {
        await presentAlert("Something went wrong", error);
      }

      await authStore.action(ActionType.auth.resetError);
    });

    particlesKey.value += 1;

    return { componentNames, particlesKey, changeComponent };
  },
};
</script>

<style scoped>
@import "../assets/style/auth.css";
.content {
  background: #f5f5f5;
}
</style>
