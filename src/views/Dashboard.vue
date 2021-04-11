<template>
  <ion-page>
    <Suspense>
      <template #default>
        <DashboardContainer />
      </template>
    </Suspense>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DashboardContainer from "@/components/DashboardContainer.vue";
import { IonPage } from "@ionic/vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    DashboardContainer,
    IonPage,
  },
});
</script>
