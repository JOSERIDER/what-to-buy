<template>
  <ion-header>
    <ion-toolbar>
      <ion-icon
        :icon="icons.trash"
        slot="end"
        color="danger"
        class="mr-4 text-2xl"
        @click="reset()"
      ></ion-icon>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-item-group>
      <ion-item @click="openPicker()">
        <ion-grid>
          <ion-row class="justify-center">
            <ion-col>
              <ion-label class="text-center ion-text-uppercase">
                Category
              </ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-label class="text-center">
                {{ currentCategory.text }}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>

      <ion-item>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-label class="text-center">Price</ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-row class="justify-center">
                <ion-col>
                  <ion-label size="1" class="text-right p-0" color="success">
                    {{ lowerPrice }}
                  </ion-label>
                </ion-col>
                <ion-col>
                  <ion-label size="1" class="text-left p-0" color="success">
                    {{ upperPrice }}
                  </ion-label>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-row>

          <ion-row class="justify-center">
            <ion-col>
              <ion-range
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
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-item-group>
    <ion-button expand="block" @click="apply()" size="small">
      Apply
    </ion-button>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonRange,
  IonRow,
  IonToolbar,
  popoverController,
} from "@ionic/vue";
import { trash, pricetagOutline } from "ionicons/icons";
import { computed, defineComponent, reactive, ref } from "vue";
import useIonicService from "@/use/useIonicService";
import useCategory from "@/use/useCategory";
import { ProductFilterInterface } from "@/models/store";

export default defineComponent({
  name: "ProductsFilterPopover",
  components: {
    IonHeader,
    IonContent,
    IonItemGroup,
    IonToolbar,
    IonIcon,
    IonButton,
    IonRow,
    IonCol,
    IonRange,
    IonGrid,
    IonLabel,
    IonItem,
  },
  props: {
    store: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { picker } = useIonicService();
    const { categories } = useCategory();
    const currentCategory = ref({} as any);
    const lowerPrice = ref(0);
    const upperPrice = ref(0);
    const rangeState = reactive({
      min: lowerPrice.value,
      max: upperPrice.value,
      initialValueRange: { lower: 1, upper: 100 },
    });
    const filterState = computed(() => {
      return props.store.state.filter;
    });
    let selectedIndex = 0;

    function openPicker() {
      picker({
        animated: true,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Choose",
            handler: val => {
              const value = val["Categories"];
              selectedIndex = categories.findIndex(i => i.value == value.value);
              currentCategory.value = value;
              return true;
            },
          },
        ],
        columns: [
          {
            name: "Categories",
            selectedIndex: selectedIndex,
            options: categories,
          },
        ],
      });
    }

    function onIonRangeChange({ lower, upper }) {
      lowerPrice.value = lower;
      upperPrice.value = upper;
    }

    function reset() {
      lowerPrice.value = 0;
      upperPrice.value = 100;
      rangeState.min = lowerPrice.value;
      rangeState.max = upperPrice.value;
      currentCategory.value = categories[0];

      selectedIndex = categories.findIndex(
        i => i.value == currentCategory.value.value
      );
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

      selectedIndex = categories.findIndex(
        i => i.value == currentCategory.value.value
      );
    }

    setInitialFilter();

    return {
      currentCategory,
      rangeState,
      lowerPrice,
      upperPrice,
      openPicker,
      reset,
      onIonRangeChange,
      apply,
      icons: {
        trash,
        pricetagOutline,
      },
    };
  },
});
</script>
