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
          <ion-button color="primary" @click="openOptions" fill="clear">
            <ion-icon size="large" :icon="icons.add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false" class="p-4">
      <VRefresher @do-refresh="doRefresh($event)" :icons="icons.dotsCircle" />
      <div class="container sm:m-auto">
        <ion-searchbar
          placeholder="Search by name"
          inputmode="text"
          @ionChange="onSearchChange($event.detail.value)"
        ></ion-searchbar>
        <div
          v-if="error || (loading && !dataFetched) || products.length === 0"
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
            @click="
              router.push({
                name: 'ProductDetail',
                params: { id: product.id },
              })
            "
          />
        </ion-list>
        <ion-infinite-scroll
          v-if="!isDisabledInfiniteScroll"
          @ionInfinite="loadData($event)"
        >
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Fetching more products…"
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
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
  IonInfiniteScrollContent,
  IonInfiniteScroll,
} from "@ionic/vue";
import { useProductsStore } from "@/store/products";
import { computed, defineComponent, onBeforeUnmount, ref } from "vue";
import { ActionType } from "@/models/store";
import ProductItem from "@/components/products/ProductItem.vue";
import ProductsEmptyView from "@/components/products/ProductsEmptyView.vue";
import VSpinner from "@/components/ui/VSpinner.vue";
import VRefresher from "@/components/ui/VRefresher.vue";
import VErrorView from "@/components/ui/VErrorView.vue";
import ProductsFilterPopover from "@/components/products/ProductsFilterPopover.vue";
import { add, filter, chevronDownCircleOutline } from "ionicons/icons";
import useIonicService from "@/use/useIonicService";
import router from "@/router";
import useScanner from "@/use/useScanner";
import apiClient from "@/api-client";

export default defineComponent({
  name: "Products",
  components: {
    ProductItem,
    ProductsEmptyView,
    VSpinner,
    VErrorView,
    VRefresher,
    IonHeader,
    IonToolbar,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
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
    const productsApiClient = apiClient.products;
    const dataFetched = ref(false);
    const loading = computed(() => {
      return productsStore.state.loading;
    });

    const isDisabledInfiniteScroll = computed(() => {
      return productsStore.state.isDisableInfiniteScroll;
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

    async function fetchProducts() {
      await productsStore.action(ActionType.products.fetchProducts);
    }

    async function doRefresh(ev) {
      await productsStore.action(ActionType.products.refresh);
      ev.target.complete();
    }

    async function loadData(ev) {
      await productsStore.action(ActionType.products.loadData);
      ev.target.complete();
    }

    async function checkProduct(productId: string) {
      const productExists = await productsApiClient.checkProduct(productId);

      if (productExists) {
        await ionicService.toast({
          message: "This product already exists on database",
          duration: 2000,
        });
      } else {
        await router.push({ name: "AddProduct", params: { id: productId } });
      }
    }

    function openScanner() {
      useScanner(resp => {
        if (!resp) return;
        checkProduct(resp);
      });
    }

    function openOptions() {
      ionicService.actionSheet({
        header: "Add new product",
        buttons: [
          {
            text: "Scan barcode",
            handler: () => openScanner(),
          },
          {
            text: "Insert manual",
            handler: () => router.push({ name: "AddProduct" }),
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      });
    }

    function openFilterPopover(event) {
      ionicService.popover({
        event,
        component: ProductsFilterPopover,
        componentProps: { store: productsStore },
        mode: "ios",
        translucent: "false",
      });
    }

    fetchProducts();
    dataFetched.value = true;

    onBeforeUnmount(() => {
      productsStore.action(ActionType.products.restoreStore);
    });

    return {
      loading,
      dataFetched,
      error,
      products,
      router,
      onSearchChange,
      fetchProducts,
      openOptions,
      doRefresh,
      openFilterPopover,
      loadData,
      isDisabledInfiniteScroll,
      icons: { filter, add, dotsCirlce: chevronDownCircleOutline },
    };
  },
});
</script>

<style scoped></style>
