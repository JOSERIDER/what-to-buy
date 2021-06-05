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
          <form @submit.prevent="updateProduct">
            <ion-label>Product Name</ion-label>
            <VInput
              :border="true"
              enterkeyhint="next"
              @enter="$refs.productEditDescription.setFocus()"
              v-model:value="state.name"
              :v$="v$.name"
              placeholder="Product name"
              name="productName"
            />

            <div class="mt-4">
              <ion-label>Product Description</ion-label>
              <VInput
                :border="true"
                ref="productEditDescription"
                enterkeyhint="next"
                @enter="$refs.productEditPrice.setFocus()"
                v-model:value="state.description"
                :v$="v$.description"
                placeholder="Product description"
                name="productDescription"
              />
            </div>

            <div class="mt-4">
              <ion-label>Product Price</ion-label>
              <VInput
                :border="true"
                type="number"
                ref="productEditPrice"
                enterkeyhint="done"
                @enter="updateProduct"
                v-model:value.number="state.price"
                :v$="v$.price"
                step="any"
                placeholder="Product price"
                name="productPrice"
              />
            </div>

            <div>
              <ion-label>Category</ion-label>
              <VPicker
                @categorySelected="currentCategory = $event"
                :options="categories"
                :category="currentCategory"
                column-name="Categories"
              />
            </div>

            <div class="flex w-full justify-center mt-4">
              <ion-button type="submit" v-if="!loading" fill="clear">
                Update product
              </ion-button>
              <VSpinner v-else />
            </div>
          </form>
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
import useCategory from "@/use/useCategory";
import apiClient from "@/api-client";
import { Product } from "@/models/domain/product";
import useKeyWordGen from "@/use/useKeyWordGen";
import { useKeyboard } from "@/use/useKeyboard";
import VPicker from "@/components/ui/VPicker.vue";

export default defineComponent({
  name: "ProductDetailEditModal",
  components: {
    VPicker,
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

    async function updateProduct() {
      if (v$.value.$invalid) {
        v$.value.$touch();
        return;
      }
      loading.value = true;
      await useKeyboard().hideKeyboard();

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
      categories,
      loading,
      updateProduct,
      close,
    };
  },
});
</script>

<style scoped></style>
