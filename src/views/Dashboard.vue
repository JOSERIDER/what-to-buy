<template>
  <ion-content>
    <Suspense>
      <template #default>
        <DashboardContainer />
      </template>
    </Suspense>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DashboardContainer from "@/components/DashboardContainer.vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    DashboardContainer,
  },
});
</script>
