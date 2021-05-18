<template>
  <ion-page>
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

    <ion-content :fullscreen="false" class="p-4">
      <div class="container sm:m-auto">
        <ion-searchbar
          placeholder="Search by name"
          inputmode="text"
          @ionChange="onSearchChange($event.detail.value)"
        ></ion-searchbar>

        <div
          v-if="error || loading || products.length === 0"
          class="flex flex-row items-center h-full justify-center"
        >
          <VErrorView
            @try-again="fetchProducts"
            v-if="error"
            :message="error"
          />
          <VSpinner v-else-if="loading" />
          <ProductsEmptyView v-else-if="products.length === 0" />
        </div>

        <ion-list v-else>
          <ProductSelectionListItem
            v-for="product in products"
            :key="product.id"
            :product="product"
            @onDecrementQuantity="decrementQuantity(product)"
            @onIncrementQuantity="incrementQuantity(product)"
            @onSelectProduct="selectProduct(product)"
            @onUnselectProduct="unselectProduct(product)"
          />
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
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
  IonPage,
} from "@ionic/vue";
import { checkmark } from "ionicons/icons";
import { useProductsSelectionStore } from "@/store/products-selection";
import { ActionType } from "@/models/store";
import useIonicService from "@/use/useIonicService";
import ProductSelectionListItem from "@/components/productSelection/ProductSelectionListItem.vue";
import { Product } from "@/models/domain/product";
import VSpinner from "@/components/ui/VSpinner.vue";
import VErrorView from "@/components/ui/VErrorView.vue";
import ProductsEmptyView from "@/components/products/ProductsEmptyView.vue";
import router from "@/router";

export default defineComponent({
  name: "ListDetailAddProduct",
  components: {
    ProductsEmptyView,
    VSpinner,
    ProductSelectionListItem,
    VErrorView,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButton,
    IonList,
    IonSearchbar,
    IonPage,
  },
  setup() {
    const productsSelectionStore = useProductsSelectionStore();
    const ionicService = useIonicService();

    const products = computed(() => {
      return productsSelectionStore.state.products;
    });

    const error = computed(() => {
      return productsSelectionStore.state.error;
    });

    const loading = computed(() => {
      return productsSelectionStore.state.loading;
    });

    function fetchProducts() {
      productsSelectionStore.action(ActionType.productsSelection.fetchProducts);
    }

    async function save() {
      await productsSelectionStore.action(
        ActionType.productsSelection.saveSelection
      );

      router.go(-1);
    }

    function onSearchChange(value: string) {
      productsSelectionStore.action(
        ActionType.productsSelection.searchProducts,
        value
      );
    }

    function incrementQuantity(product: Product) {
      productsSelectionStore.action(
        ActionType.productsSelection.incrementQuantity,
        product
      );
    }

    function decrementQuantity(product: Product) {
      productsSelectionStore.action(
        ActionType.productsSelection.decrementQuantity,
        product
      );
    }

    function selectProduct(product: Product) {
      productsSelectionStore.action(
        ActionType.productsSelection.selectProduct,
        product
      );
    }

    function unselectProduct(product: Product) {
      productsSelectionStore.action(
        ActionType.productsSelection.unselectProduct,
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

    fetchProducts();

    return {
      products,
      error,
      loading,
      save,
      fetchProducts,
      unselectProduct,
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
