<template>
  <Suspense>
    <template #default>
      <DashboardList />
    </template>
    <template #fallback>
      <TheLoading />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DashboardList from "@/components/DashboardList.vue";
import TheLoading from "@/components/TheLoading.vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    TheLoading,
    DashboardList,
  },
});
</script>
