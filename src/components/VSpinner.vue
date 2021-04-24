<template>
  <div class="flex justify-center">
    <ion-spinner :name="name"></ion-spinner>
  </div>
</template>
<script lang="ts">
import { IonSpinner } from "@ionic/vue";

export default {
  name: "VSpinner",
  components: {
    IonSpinner,
  },
  props: {
    name: {
      type: String,
      default: "lines",
    },
  },
};
</script>
