<template>
  <ion-item>
    <ion-icon
      size="large"
      :color="product.selected ? 'success' : ''"
      :icon="product.selected ? icons.checkmarkCircle : icons.ellipse"
      @click="$emit('onSelectProduct', product)"
    ></ion-icon>
    <ion-label>{{ product.product.name }}</ion-label>
    <ion-row
      v-if="product.selected"
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
          <ion-label class="ion-text-center chip"
            >{{ product.product.quantity }}
          </ion-label>
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
import { IonCol, IonItem, IonLabel, IonRow } from "@ionic/vue";
import { PropType } from "vue";
import { ProductSelectionType } from "@/models/store";
import {
  addCircleOutline,
  checkmark,
  checkmarkCircle,
  ellipseOutline,
  removeCircleOutline,
} from "ionicons/icons";

export default {
  name: "ProductSelectionListItem",
  emits: ["onDecrementQuantity", "onSelectProduct", "onIncrementQuantity"],
  components: {
    IonCol,
    IonRow,
    IonLabel,
    IonItem,
  },
  props: {
    product: {
      type: Object as PropType<ProductSelectionType>,
      required: true,
    },
  },
  data() {
    return {
      icons: {
        ellipse: ellipseOutline,
        checkmarkCircle,
        checkmark,
        remove: removeCircleOutline,
        add: addCircleOutline,
      },
    };
  },
};
</script>
