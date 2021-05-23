<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Edit product</ion-title>
        <ion-button @click="close()" fill="clear" slot="end" color="primary">
          <ion-text>Close</ion-text>
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="m-4">
        <div class="mt-4">
          <ion-label>Product Name</ion-label>
          <VInput
            :border="true"
            v-model:value="state.name"
            :v$="v$.name"
            placeholder="Product name"
            name="listName"
          />
        </div>

        <div class="mt-4">
          <ion-label>Product Description</ion-label>
          <VTextarea
            :border="true"
            v-model:value="state.description"
            :v$="v$.description"
            placeholder="Product description"
            name="listName"
          />
        </div>

        <div class="mt-4">
          <ion-label>Product Price</ion-label>
          <VInput
            :border="true"
            type="number"
            v-model:value.number="state.price"
            :v$="v$.price"
            placeholder="Product price"
            name="listName"
          />
        </div>

        <div>
          <ion-label>Category</ion-label>
          <h2
            class="text-center mt-2 border p-2 rounded shadow"
            @click="openPicker"
          >
            {{ currentCategory.text ? currentCategory.text : product.category }}
          </h2>
        </div>

        <div class="flex w-full justify-center mt-4">
          <ion-button v-if="!loading" @click="updateProduct" fill="clear">
            Update product
          </ion-button>
          <VSpinner v-else />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import VInput from "@/components/ui/VInput.vue";
import VSpinner from "@/components/ui/VSpinner.vue";
import { computed, defineComponent, PropType, reactive, ref } from "vue";
import { minLength, numeric, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import VTextarea from "@/components/ui/VTextarea.vue";
import useCategory from "@/use/useCategory";
import useIonicService from "@/use/useIonicService";
import apiClient from "@/api-client";
import { Product } from "@/models/domain/product";
import useKeyWordGen from "@/use/useKeyWordGen";

export default defineComponent({
  name: "ProductDetailEditModal",
  components: {
    VTextarea,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    VInput,
    VSpinner,
    IonText,
    IonButton,
    IonLabel,
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      name: props.product.name,
      description: props.product.description,
      price: props.product.price,
    });
    const { categories } = useCategory();
    const currentCategory = ref({} as any);
    const { picker } = useIonicService();
    const productsApiClient = apiClient.products;
    const rules = computed(() => {
      return {
        name: {
          required,
          minLength: minLength(4),
        },
        description: {
          required,
          minLength: minLength(4),
        },
        price: {
          required,
          numeric,
        },
      };
    });
    const loading = ref(false);

    const v$ = useVuelidate(rules, state);

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
              currentCategory.value = val["Categories"];
              return true;
            },
          },
        ],
        columns: [
          {
            name: "Categories",
            options: categories,
          },
        ],
      });
    }

    async function updateProduct() {
      if (v$.value.$invalid) {
        v$.value.$touch();
        return;
      }
      loading.value = true;
      const product = { ...props.product };
      product.name = state.name;
      product.description = state.description;
      product.category = currentCategory.value.text;
      product.price = state.price;
      product.keyWords = useKeyWordGen().generateKeywords([product.name]);

      await productsApiClient.update(product.id!!, product);
      loading.value = false;
      await modalController.dismiss();
    }

    function close() {
      modalController.dismiss();
    }
    categories.splice(0, 1);
    currentCategory.value = categories.find(
      category => category.text === props.product.category
    );
    return {
      v$,
      state,
      currentCategory,
      loading,
      openPicker,
      updateProduct,
      close,
    };
  },
});
</script>

<style scoped></style>
