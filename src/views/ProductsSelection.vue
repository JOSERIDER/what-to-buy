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
      <ProductSelectionListItem
        v-for="product in products"
        :key="product.product.id"
        :product="product"
        @onDecrementQuantity="decrementQuantity(product)"
        @onIncrementQuantity="incrementQuantity(product)"
        @onSelectProduct="selectProduct(product)"
      />
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import {
  IonButton,
  IonHeader,
  IonIcon,
  IonList,
  IonTitle,
  IonToolbar,
  IonSearchbar,
} from "@ionic/vue";
import { checkmark } from "ionicons/icons";
import { useProductsSelectionStore } from "@/store/products-selection";
import { ActionType, ProductSelectionType } from "@/models/store";
import { useRouter } from "vue-router";
import useIonicService from "@/use/useIonicService";
import ProductSelectionListItem from "@/components/productSelection/ProductSelectionListItem.vue";

export default defineComponent({
  name: "ListDetailAddProduct",
  components: {
    ProductSelectionListItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButton,
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
        checkmark,
      },
    };
  },
});
</script>
