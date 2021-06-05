<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button color="danger" fill="clear" @click="reset()">
          <ion-icon
            :icon="icons.refresh"
            slot="end"
            color="danger"
            class="mr-4 text-2xl"
          ></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="flex flex-col m-5 space-y-2">
      <p class="font-bold uppercase text-center">Category</p>
      <VPicker
        @categorySelected="currentCategory = $event"
        :category="currentCategory"
        :options="categories"
        column-name="Categories"
      />
    </div>

    <div class="border-b-2 w-full mb-2"></div>
    <div>
      <p class="font-bold uppercase text-center mb-2">Price</p>
      <p class="text-center font-light text-lg">
        {{ lowerPrice }} - {{ upperPrice }} €
      </p>
      <ion-range
        :key="key"
        :value="rangeState.initialValueRange"
        mode="md"
        dualKnobs="true"
        :min="rangeState.min"
        :max="rangeState.max"
        step="1"
        @ionChange="onIonRangeChange($event.detail.value)"
      >
        <ion-icon
          size="small"
          slot="start"
          :icon="icons.pricetagOutline"
        ></ion-icon>
        <ion-icon slot="end" :icon="icons.pricetagOutline"></ion-icon>
      </ion-range>
    </div>

    <ion-button class="m-2 shadow" expand="block" @click="apply()" size="small">
      APPLY
    </ion-button>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonRange,
  IonToolbar,
  popoverController,
} from "@ionic/vue";
import { refresh, pricetagOutline } from "ionicons/icons";
import { computed, defineComponent, reactive, ref } from "vue";
import useCategory from "@/use/useCategory";
import { ProductFilterInterface } from "@/models/store";
import VPicker from "@/components/ui/VPicker.vue";

export default defineComponent({
  name: "ProductsFilterPopover",
  components: {
    VPicker,
    IonHeader,
    IonContent,
    IonToolbar,
    IonIcon,
    IonButton,
    IonRange,
    IonButtons,
  },
  props: {
    store: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { categories } = useCategory();
    const currentCategory = ref({} as any);
    const lowerPrice = ref(0);
    const upperPrice = ref(0);
    const key = ref(0);
    const rangeState = reactive({
      min: lowerPrice.value,
      max: upperPrice.value,
      initialValueRange: { lower: 1, upper: 100 },
    });
    const filterState = computed(() => {
      return props.store.state.filter;
    });

    function onIonRangeChange({ lower, upper }) {
      lowerPrice.value = lower;
      upperPrice.value = upper;
    }

    function reset() {
      rangeState.initialValueRange.lower = 0;
      rangeState.initialValueRange.upper = 100;
      lowerPrice.value = 0;
      upperPrice.value = 100;
      rangeState.min = lowerPrice.value;
      rangeState.max = upperPrice.value;
      currentCategory.value = categories[0];
      key.value += 1;
    }

    async function apply() {
      const filters: ProductFilterInterface = {
        minPrice: lowerPrice.value,
        maxPrice: upperPrice.value,
        category: currentCategory.value,
        name: props.store.state.name,
      };

      await props.store.action("setFilter", filters);
      await props.store.action("fetchFilterProducts");

      await popoverController.dismiss();
    }

    function setInitialFilter() {
      currentCategory.value = filterState.value.category;
      lowerPrice.value = filterState.value.minPrice;
      upperPrice.value = filterState.value.maxPrice;
      rangeState.min = 0;
      rangeState.max = 100;
      rangeState.initialValueRange.lower = lowerPrice.value;
      rangeState.initialValueRange.upper = upperPrice.value;
    }

    setInitialFilter();

    return {
      currentCategory,
      rangeState,
      lowerPrice,
      upperPrice,
      key,
      categories,
      reset,
      onIonRangeChange,
      apply,
      icons: {
        refresh,
        pricetagOutline,
      },
    };
  },
});
</script>
