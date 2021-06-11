<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Product selection</ion-title>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack()" default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            color="primary"
            @click="openFilterPopover($event)"
            fill="clear"
          >
            <ion-icon size="large" :icon="icons.filter"></ion-icon>
          </ion-button>
          <ion-button color="success" @click="save()" fill="clear">
            <ion-icon size="large" :icon="icons.checkmark"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false" class="p-4">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Product selection</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="container sm:m-auto">
        <VSearchBar
          placeholder="Search by name"
          inputmode="text"
          @onSearchChange="onSearchChange($event.detail.value)"
          enter-keyhint="search"
          @enter="hideKeyboard"
        />

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
import { computed, defineComponent, onUnmounted, ref } from "vue";
import {
  IonButton,
  IonHeader,
  IonIcon,
  IonList,
  IonTitle,
  IonToolbar,
  IonPage,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonContent,
  IonBackButton,
  IonButtons,
} from "@ionic/vue";
import { checkmark, filter } from "ionicons/icons";
import { useProductsSelectionStore } from "@/store/products-selection";
import { ActionType } from "@/models/store";
import useIonicService from "@/use/useIonicService";
import ProductSelectionListItem from "@/components/productSelection/ProductSelectionListItem.vue";
import { Product } from "@/models/domain/product";
import VSpinner from "@/components/ui/VSpinner.vue";
import VErrorView from "@/components/ui/VErrorView.vue";
import ProductsEmptyView from "@/components/products/ProductsEmptyView.vue";
import router from "@/router";
import ProductsFilterPopover from "@/components/products/ProductsFilterPopover.vue";
import VSearchBar from "@/components/ui/VSearchBar.vue";
import { useKeyboard } from "@/use/useKeyboard";

export default defineComponent({
  name: "ProductsSelection",
  components: {
    VSearchBar,
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
    IonPage,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonContent,
    IonBackButton,
    IonButtons,
  },
  setup() {
    const productsSelectionStore = useProductsSelectionStore();
    const { alert, popover } = useIonicService();
    const { hideKeyboard } = useKeyboard();
    const dataFetched = ref(false);

    const products = computed(() => {
      return productsSelectionStore.state.products;
    });

    const error = computed(() => {
      return productsSelectionStore.state.error;
    });

    const loading = computed(() => {
      return productsSelectionStore.state.loading;
    });

    const isDisabledInfiniteScroll = computed(() => {
      return productsSelectionStore.state.isDisableInfiniteScroll;
    });

    function fetchProducts() {
      productsSelectionStore.action(ActionType.productsSelection.fetchProducts);
    }

    async function loadData(ev) {
      await productsSelectionStore.action(
        ActionType.productsSelection.loadData
      );
      ev.target.complete();
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
        value.trim()
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
      await alert({
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

    function openFilterPopover(event) {
      popover({
        event,
        component: ProductsFilterPopover,
        componentProps: { store: productsSelectionStore },
        mode: "ios",
        translucent: "false",
      });
    }

    fetchProducts();
    dataFetched.value = true;

    onUnmounted(() => {
      productsSelectionStore.action(ActionType.productsSelection.restoreStore);
    });

    return {
      products,
      error,
      loading,
      isDisabledInfiniteScroll,
      dataFetched,
      hideKeyboard,
      save,
      fetchProducts,
      unselectProduct,
      onSearchChange,
      incrementQuantity,
      decrementQuantity,
      selectProduct,
      goBack,
      loadData,
      openFilterPopover,
      icons: {
        checkmark,
        filter,
      },
    };
  },
});
</script>
