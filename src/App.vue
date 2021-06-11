<template>
  <IonApp>
    <VDrawerMenu>
      <template #content="{contentId}">
        <ion-router-outlet :id="contentId" :key="$route.fullPath" />
      </template>
    </VDrawerMenu>
  </IonApp>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, useBackButton } from "@ionic/vue";
import { defineComponent } from "vue";
import VDrawerMenu from "@/components/ui/VDrawerMenu.vue";
import { useUserStore } from "@/store/user";
import { ActionType, MutationType } from "@/models/store";
import { firebaseAuth } from "@/api-client";
import { useAuthsStore } from "@/store/auth";
import { Plugins } from "@capacitor/core";
import router from "@/router";
import useIonicService from "@/use/useIonicService";
const { App } = Plugins;

export default defineComponent({
  name: "App",
  components: {
    VDrawerMenu,
    IonApp,
    IonRouterOutlet,
  },
  async created() {
    const userStore = useUserStore();
    const { alert } = useIonicService();
    await userStore.action(MutationType.user.getUser);
    useBackButton(0, processNextHandler => {
      const currentRoute = router.currentRoute.value.name;
      if (
        currentRoute === "Dashboard" ||
        currentRoute === "RequireAuth" ||
        currentRoute === "Auth"
      ) {
        alert({
          header: "Close App",
          message: "Are you sure you want to close App?",
          inputs: [],
          buttons: [
            { text: "Cancel", role: "cancel" },
            { text: "Continue", handler: () => App.exitApp() },
          ],
        });

        return;
      }

      if (currentRoute === "ProductsSelection") {
        alert({
          header: "Are you sure ?",
          message: "If you go back without saving, your changes will lost.",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Continue",
              handler: () => router.back(),
            },
          ],
          inputs: [],
        });

        return;
      }

      processNextHandler();
    });

    firebaseAuth.onAuthStateChanged(user => {
      useAuthsStore().action(ActionType.auth.setUser, user);
    });
  },
});
</script>
