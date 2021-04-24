<template>
  <ion-refresher
    slot="fixed"
    class="mt-4"
    @ionRefresh="$emit('doRefresh', $event)"
  >
    <ion-refresher-content
      :pulling-icon="circleOutline"
      pulling-text="Pull to refresh"
      refreshing-spinner="lines"
    >
    </ion-refresher-content>
  </ion-refresher>
</template>
<script>
import { IonRefresher, IonRefresherContent } from "@ionic/vue";
import { chevronDownCircleOutline } from "ionicons/icons";

export default {
  name: "VRefresher",
  data() {
    return {
      circleOutline: chevronDownCircleOutline,
    };
  },
  components: {
    IonRefresher,
    IonRefresherContent,
  },
};
</script>
