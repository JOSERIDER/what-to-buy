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
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import VDrawerMenu from "@/components/VDrawerMenu.vue";
import { useUserStore } from "@/store/user";
import { MutationType } from "@/models/store";

export default defineComponent({
  name: "App",
  components: {
    VDrawerMenu,
    IonApp,
    IonRouterOutlet,
  },
  async created() {
    const userStore = useUserStore();
    await userStore.action(MutationType.user.getUser);
  },
});
</script>
