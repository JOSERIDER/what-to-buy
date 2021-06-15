<template>
  <ion-content>
    <ion-grid fixed>
      <ion-row
        class="button ion-justify-content-center ion-margin-bottom"
        @click="scanBarcode()"
      >
        <ion-col size="3">
          <ion-icon size="large" color="primary" :icon="icon.scan"></ion-icon>
        </ion-col>
        <ion-col size="12">
          <p class="ion-text-center ion-no-margin">Scan</p>
        </ion-col>
      </ion-row>

      <ion-row
        class="button ion-justify-content-center"
        @click="selectProducts()"
      >
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

<script lang="ts">
import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
  popoverController,
} from "@ionic/vue";
import { scan, searchOutline } from "ionicons/icons";
import useScanner from "@/use/useScanner";
import apiClient from "@/api-client";
import { defineComponent } from "vue";
import { useListDetailStore } from "@/store/list-detail";
import { ActionType } from "@/models/store";
import useIonicService from "@/use/useIonicService";
import router from "@/router";

export default defineComponent({
  name: "ListDetailAddProductPopover",
  components: {
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonRow,
  },
  setup() {
    const listDetailStore = useListDetailStore();
    const { toast } = useIonicService();

    function addProduct(barcode: string) {
      apiClient.products
        .getProductByBarcode(barcode)
        .then(product =>
          listDetailStore.action(ActionType.listDetail.addProduct, product)
        )
        .catch(() =>
          toast({
            message: "This product doesn't exits, add it first.",
            duration: 2000,
          })
        );
    }

    function scanBarcode() {
      useScanner(resp => {
        if (!resp) return;
        addProduct(resp);
      });
      popoverController.dismiss();
    }

    function selectProducts() {
      popoverController.dismiss();
      router.push({ name: "ProductsSelection" });
    }

    return {
      scanBarcode,
      selectProducts,
      icon: {
        scan: scan,
        search: searchOutline,
      },
    };
  },
});
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
