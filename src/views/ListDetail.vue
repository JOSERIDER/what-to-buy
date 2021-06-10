<template>
  <ion-page>
    <ion-header :style="{ 'background-color': list.color }">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/" text="Back"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ loading ? "loading..." : list.name }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            v-if="listType !== 'Private'"
            @click="saveList"
            color="primary"
            fill="clear"
          >
            <ion-icon :icon="save" size="large"></ion-icon>
          </ion-button>
          <ion-button color="primary" @click="addProduct($event)" fill="clear">
            <ion-icon :icon="add" size="large"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="container sm:m-auto">
        <div
          v-if="error || isEmptyList || loading"
          class="flex flex-row items-center h-full justify-center"
        >
          <VErrorView v-if="error" :message="error" />

          <ListDetailEmptyView
            @add-product="addProduct($event)"
            v-else-if="isEmptyList && !loading"
          />

          <VSpinner v-if="loading && !error" />
        </div>

        <div>
          <ListDetailAmountHeader
            v-if="!isEmptyList && !loading"
            class="sticky top-0 z-50"
            :color="list.color"
            :summary="summary"
          />

          <ion-list v-if="!isEmptyList && !loading" class="z-0 pt-0">
            <ListDetailItem
              v-for="product in products"
              :product="product"
              :key="product.id"
              @increment-quantity="incrementQuantity($event)"
              @decrement-quantity="decrementQuantity($event)"
            />
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import ListDetailItem from "@/components/listDetail/ListDetailItem.vue";
import { computed, defineComponent, onMounted, onUnmounted, watch } from "vue";
import { add, saveOutline } from "ionicons/icons";
import { useListDetailStore } from "@/store/list-detail";
import { Product } from "@/models/domain/product";
import { ActionType } from "@/models/store";
import ListDetailEmptyView from "@/components/listDetail/ListDetailEmptyView.vue";
import ListDetailAmountHeader from "@/components/listDetail/ListDetailAmountHeader.vue";
import VErrorView from "@/components/ui/VErrorView.vue";
import VSpinner from "@/components/ui/VSpinner.vue";
import ListDetailAddProductPopover from "../components/listDetail/ListDetailAddProductPopover.vue";
import useIonicService from "@/use/useIonicService";

export default defineComponent({
  name: "ListDetail",
  components: {
    VSpinner,
    VErrorView,
    ListDetailAmountHeader,
    ListDetailEmptyView,
    ListDetailItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonIcon,
    IonContent,
    IonPage,
  },
  props: {
    listId: {
      type: String,
      required: true,
    },
    listType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const listDetailStore = useListDetailStore();

    const summary = computed(() => {
      return listDetailStore.state.summary;
    });

    const products = computed(() => {
      return listDetailStore.state.products;
    });

    const list = computed(() => {
      return listDetailStore.state.list;
    });

    const error = computed(() => {
      return listDetailStore.state.error;
    });

    const loading = computed(() => {
      return listDetailStore.state.loading;
    });

    const isEmptyList = computed(() => {
      return listDetailStore.state.products.length === 0;
    });

    const listener = computed(() => {
      return listDetailStore.state.listener;
    });

    const { popover } = useIonicService();

    watch(list, () =>
      listDetailStore.action(ActionType.listDetail.fetchProducts)
    );

    function incrementQuantity(product: Product) {
      listDetailStore.action(ActionType.listDetail.incrementQuantity, product);
      listDetailStore.action(ActionType.listDetail.updateSummary);
    }

    function decrementQuantity(product: Product) {
      listDetailStore.action(ActionType.listDetail.decrementQuantity, product);
      listDetailStore.action(ActionType.listDetail.updateSummary);
    }

    function fetchProducts() {
      listDetailStore.action(ActionType.listDetail.fetchList, {
        listId: props.listId,
        listType: props.listType,
      });
    }

    async function openPopover(ev: Event) {
      await popover({
        component: ListDetailAddProductPopover,
        componentProps: { listId: props.listId },
        event: ev,
        mode: "ios",
        translucent: false,
      });
    }

    function addProduct(event) {
      openPopover(event);
    }
    async function saveList() {
      await listDetailStore.action(
        ActionType.listDetail.updateList,
        props.listType
      );
    }

    onMounted(() => listener.value);
    onUnmounted(async () => {
      await saveList();
      if (listener.value) {
        listener.value();
      }
    });

    fetchProducts();

    listDetailStore.action(ActionType.listDetail.setType, props.listType);

    return {
      summary,
      products,
      list,
      error,
      loading,
      isEmptyList,
      add,
      save: saveOutline,
      saveList,
      addProduct,
      incrementQuantity,
      decrementQuantity,
    };
  },
});
</script>

<style scoped></style>
