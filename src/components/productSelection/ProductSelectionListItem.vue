<template>
  <ion-item class="h-14">
    <ion-icon
      size="large"
      :color="isSelected ? 'success' : ''"
      :icon="isSelected ? icons.checkmarkCircle : icons.ellipse"
      @click="
        $emit(isSelected ? 'onUnselectProduct' : 'onSelectProduct', product)
      "
    ></ion-icon>
    <ion-label>{{ product.name }}</ion-label>
    <ion-row
      v-if="isSelected"
      class="ion-align-items-center ion-align-items-center row"
    >
      <ion-col>
        <ion-button
          @click="$emit('onDecrementQuantity', product)"
          fill="clear"
          color="dark"
        >
          <ion-icon :icon="icons.remove" size="small" class="icon"></ion-icon>
        </ion-button>
      </ion-col>
      <ion-col>
        <ion-chip>
          <ion-label class="ion-text-center chip">{{ quantity }} </ion-label>
        </ion-chip>
      </ion-col>
      <ion-col>
        <ion-button
          @click="$emit('onIncrementQuantity', product)"
          fill="clear"
          color="dark"
        >
          <ion-icon :icon="icons.add" size="small" class="icon"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-item>
</template>
<script lang="ts">
import {
  IonButton,
  IonChip,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
} from "@ionic/vue";
import { computed, defineComponent, PropType } from "vue";
import {
  addCircleOutline,
  checkmark,
  checkmarkCircle,
  ellipseOutline,
  removeCircleOutline,
} from "ionicons/icons";
import { Product } from "@/models/domain/product";
import { useProductsSelectionStore } from "@/store/products-selection";

export default defineComponent({
  name: "ProductSelectionListItem",
  emits: [
    "onDecrementQuantity",
    "onSelectProduct",
    "onIncrementQuantity",
    "onUnselectProduct",
  ],
  components: {
    IonCol,
    IonRow,
    IonLabel,
    IonItem,
    IonChip,
    IonIcon,
    IonButton,
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  setup(props) {
    const productSelectionStore = useProductsSelectionStore();

    const isSelected = computed(() => {
      return (
        productSelectionStore.state.productsSelected.findIndex(
          dataProduct => dataProduct.idProduct === props.product.id
        ) >= 0
      );
    });

    const quantity = computed(() => {
      return productSelectionStore.state.productsSelected.find(
        dataProduct => dataProduct.idProduct === props.product.id
      )?.cant;
    });

    return {
      isSelected,
      quantity,
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
