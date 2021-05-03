<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Add products</ion-title>
      <ion-buttons slot="start">
        <ion-back-button @click="goBack()" default-href="/"></ion-back-button>
      </ion-buttons>
      <ion-button slot="end" color="success" @click="save()" fill="clear">
        <ion-icon size="large" :icon="icons.checkmark"></ion-icon>
      </ion-button>
    </ion-toolbar>
  </ion-header>

  <ion-content :fullscreen="true">
    <ion-searchbar
      placeholder="Search by name"
      inputmode="text"
      @ionChange="onSearchChange($event)"
    ></ion-searchbar>
    <ion-list>
      <ion-item v-for="product in products" :key="product.product.id">
        <ion-icon
          size="large"
          :color="product.selected ? 'success' : ''"
          :icon="product.selected ? icons.checkmark : icons.ellipse"
          @click="selectProduct(product)"
        ></ion-icon>

        <ion-label>{{ product.product.name }} </ion-label>
        <ion-row
          v-if="product.selected"
          class="ion-align-items-center ion-align-items-center row"
        >
          <ion-col>
            <ion-button
              @click="decrementQuantity(product)"
              fill="clear"
              color="dark"
            >
              <ion-icon
                :icon="icons.remove"
                size="small"
                class="icon"
              ></ion-icon>
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-chip>
              <ion-label class="ion-text-center chip">{{
                product.product.quantity
              }}</ion-label>
            </ion-chip>
          </ion-col>
          <ion-col>
            <ion-button
              @click="incrementQuantity(product)"
              fill="clear"
              color="dark"
            >
              <ion-icon :icon="icons.add" size="small" class="icon"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import {
  IonButton,
  IonCol,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonTitle,
  IonToolbar,
  IonSearchbar,
} from "@ionic/vue";
import {
  ellipseOutline,
  checkmarkCircle,
  checkmark,
  removeCircleOutline,
  addCircleOutline,
} from "ionicons/icons";
import { useProductsSelectionStore } from "@/store/products-selection";
import { ActionType, ProductSelectionType } from "@/models/store";
import { useRouter } from "vue-router";
import useIonicService from "@/use/useIonicService";

export default defineComponent({
  name: "ListDetailAddProduct",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButton,
    IonCol,
    IonRow,
    IonLabel,
    IonItem,
    IonList,
    IonSearchbar,
  },
  setup() {
    const productsSelectionStore = useProductsSelectionStore();
    const router = useRouter();
    const products = computed(() => {
      return productsSelectionStore.state.products;
    });

    const ionicService = useIonicService();

    const error = computed(() => {
      return productsSelectionStore.state.error;
    });

    async function save() {
      await productsSelectionStore.action(
        ActionType.productsSelection.saveSelection
      );
      router.go(-1);
    }

    function onSearchChange() {
      //TODO
    }

    function incrementQuantity(product: ProductSelectionType) {
      productsSelectionStore.action(
        ActionType.productsSelection.incrementQuantity,
        product
      );
    }

    function decrementQuantity(product: ProductSelectionType) {
      productsSelectionStore.action(
        ActionType.productsSelection.decrementQuantity,
        product
      );
    }

    function selectProduct(product: ProductSelectionType) {
      productsSelectionStore.action(
        ActionType.productsSelection.selectProduct,
        product
      );
    }

    async function goBack() {
      await ionicService.alert({
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
            handler: () => router.go(-1),
          },
        ],
        inputs: [],
      });
    }

    productsSelectionStore.action(ActionType.productsSelection.fetchProducts);

    return {
      products,
      error,
      save,
      onSearchChange,
      incrementQuantity,
      decrementQuantity,
      selectProduct,
      goBack,
      icons: {
        ellipse: ellipseOutline,
        checkmarkCircle,
        checkmark,
        remove: removeCircleOutline,
        add: addCircleOutline,
      },
    };
  },
});
</script>

<style scoped></style>
