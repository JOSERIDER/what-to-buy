<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-menu-button slot="start"> </ion-menu-button>
        <ion-title>Products</ion-title>
        <ion-buttons slot="end">
          <ion-button
            color="primary"
            @click="openFilterPopover($event)"
            fill="clear"
          >
            <ion-icon size="large" :icon="icons.filter"></ion-icon>
          </ion-button>
          <ion-button color="primary" @click="openFilterPopover" fill="clear">
            <ion-icon size="large" :icon="icons.add"></ion-icon>
          </ion-button>
        </ion-buttons>
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
          <ProductItem
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { useProductsStore } from "@/store/products";
import { computed, defineComponent } from "vue";
import { ActionType } from "@/models/store";
import ProductItem from "@/components/products/ProductItem.vue";
import ProductsEmptyView from "@/components/products/ProductsEmptyView.vue";
import VSpinner from "@/components/ui/VSpinner.vue";
import VErrorView from "@/components/ui/VErrorView.vue";
import ProductsFilterPopover from "@/components/products/ProductsFilterPopover.vue";
import { add, filter } from "ionicons/icons";
import useIonicService from "@/use/useIonicService";

export default defineComponent({
  name: "Products",
  components: {
    ProductItem,
    ProductsEmptyView,
    VSpinner,
    VErrorView,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonSearchbar,
    IonPage,
    IonMenuButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonButton,
  },
  setup() {
    const productsStore = useProductsStore();
    const ionicService = useIonicService();

    const loading = computed(() => {
      return productsStore.state.loading;
    });

    const error = computed(() => {
      return productsStore.state.error;
    });

    const products = computed(() => {
      return productsStore.state.products;
    });

    function onSearchChange(value: string) {
      productsStore.action(ActionType.products.getProductsByName, value);
    }

    function fetchProducts() {
      productsStore.action(ActionType.products.fetchProducts);
    }

    function save() {
      //TODO
    }

    function openFilterPopover(event) {
      ionicService.popover({
        event,
        component: ProductsFilterPopover,
        componentProps: null,
        mode: "ios",
        translucent: "false",
      });
    }

    fetchProducts();

    return {
      loading,
      error,
      products,
      onSearchChange,
      fetchProducts,
      save,
      openFilterPopover,
      icons: { filter, add },
    };
  },
});
</script>

<style scoped></style>
