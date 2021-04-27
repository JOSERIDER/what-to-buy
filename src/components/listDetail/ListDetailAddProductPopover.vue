<template>
  <ion-content>
    <ion-grid fixed>
      <ion-row
        class="button ion-justify-content-center ion-margin-bottom"
        @click="scan()"
      >
        <ion-col size="3">
          <ion-icon size="large" color="primary" :icon="icon.scan"></ion-icon>
        </ion-col>
        <ion-col size="12">
          <p class="ion-text-center ion-no-margin">Scan</p>
        </ion-col>
      </ion-row>

      <ion-row class="button ion-justify-content-center" @click="find()">
        <ion-col size="3">
          <ion-icon size="large" color="primary" :icon="icon.search"></ion-icon>
        </ion-col>
        <ion-col size="12">
          <p class="ion-text-center ion-no-margin">Search</p>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script>
import { IonCol, IonRow } from "@ionic/vue";
import { scan, searchOutline } from "ionicons/icons";

export default {
  name: "ListDetailAddProductPopover",
  components: {
    IonRow,
    IonCol,
  },
  data() {
    return {
      icon: {
        scan,
        search: searchOutline,
      },
    };
  },
};
</script>

<style scoped>
.button {
  background-color: var(--ion-color-light);
  border-radius: 5px;
}
.button p {
  color: var(--ion-color-primary);
}

.button:active {
  background-color: var(--ion-color-light-shade);
}
</style>
