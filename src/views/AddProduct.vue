<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Add product</ion-title>
        <ion-back-button
          slot="start"
          @click="router.go(-1)"
          defaultHref="/"
        ></ion-back-button>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="flex flex-col items-center  justify-center mt-10 ">
        <img
          class="w-32 h-32 rounded"
          :src="
            photo
              ? photo.webviewPath
              : require('@/assets/resources/products/add-image.png')
          "
          @click="openCameraOptions"
          alt="Product image"
        />
        <p class="text-lg font-extralight mt-3">Take a cool picture</p>
      </div>

      <ion-card class="flexbox ion-padding">
        <!-- name -->
        <form class="space-y-4" @submit.prevent="save">
          <div class="space-y-1">
            <p class="font-bold">Name</p>
            <VInput
              class="shadow"
              name="productName"
              capitalize="words"
              enterkeyhint="next"
              @enter="$refs.description.setFocus()"
              v-model:value="state.name"
              :v$="v$.name"
              placeholder="product name"
            />
          </div>

          <!-- Description -->
          <div class="space-y-1">
            <p class="font-bold">Description</p>
            <VInput
              class="shadow"
              ref="description"
              enterkeyhint="next"
              @enter="$refs.price.setFocus()"
              name="productDescription"
              v-model:value="state.description"
              placeholder="Description"
              :v$="v$.description"
            />
          </div>

          <!-- Category -->
          <div class="space-y-1">
            <p class="font-bold">Category</p>
            <VPicker
              @categorySelected="currentCategory = $event"
              :options="categories"
              :category="currentCategory"
              column-name="Categories"
            />
          </div>

          <!-- Price -->
          <div class="space-y-1">
            <p class="font-bold">Price</p>
            <VInput
              ref="price"
              name="productPrice"
              enterkeyhint="done"
              @enter="save"
              v-model:value.number="state.price"
              placeholder="price"
              :v$="v$.price"
              type="number"
            />
          </div>

          <ion-button
            v-if="!loading"
            type="submit"
            @click="save()"
            expand="block"
          >
            Save
          </ion-button>
          <ion-button v-else expand="block">
            <VSpinnerButtonLoading />
          </ion-button>
        </form>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import router from "@/router";
import VInput from "@/components/ui/VInput.vue";
import useVuelidate from "@vuelidate/core";
import VSpinnerButtonLoading from "@/components/ui/VSpinnerButtonLoading.vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { maxLength, minLength, numeric, required } from "@vuelidate/validators";
import useIonicService from "@/use/useIonicService";
import useCategory from "../use/useCategory";
import { usePhotoGallery } from "@/use/usePhotoGallery";
import { useProductsStore } from "@/store/products";
import { ActionType } from "@/models/store";
import { ProductDomainBuilder } from "@/models/domain/product/ProductDomain.builder";
import apiClient from "@/api-client";
import { Product } from "@/models/domain/product";
import { useKeyboard } from "@/use/useKeyboard";
import VPicker from "@/components/ui/VPicker.vue";

export default defineComponent({
  name: "AddProduct",
  components: {
    VPicker,
    VSpinnerButtonLoading,
    VInput,
    IonPage,
    IonContent,
    IonButton,
    IonCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
  },
  setup() {
    const { toast, actionSheet } = useIonicService();
    const { categories } = useCategory();
    const { hideKeyboard } = useKeyboard();
    const { takePhotoCamera, selectFromGallery, photo } = usePhotoGallery();
    const currentCategory = ref({} as any);
    const productsStore = useProductsStore();
    const productApiClient = apiClient.products;
    const state = reactive({
      name: "",
      description: "",
      category: "",
      price: 0,
    });
    const productId: string = router.currentRoute.value.params.id as string;
    const loading = computed(() => {
      return productsStore.state.loading;
    });
    //Form validations.
    const rules = computed(() => {
      return {
        name: {
          required,
          minLength: minLength(4),
        },
        description: {
          required,
          maxLength: maxLength(30),
        },
        price: {
          required,
          numeric,
        },
      };
    });

    function openCameraOptions() {
      actionSheet({
        header: "Photo source",
        buttons: [
          {
            text: "Take picture",
            handler: () => takePhotoCamera(),
          },
          {
            text: "Select from gallery",
            handler: () => selectFromGallery(),
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      });
    }

    const v$ = useVuelidate(rules, state);

    function createProduct(): Product {
      return ProductDomainBuilder.build(
        state.name,
        state.description,
        state.price,
        currentCategory.value.text,
        productId
      );
    }

    async function addProduct(product: Product) {
      await productsStore.action(ActionType.products.addProduct, {
        base64Data: photo.value?.base64Data,
        fileName: photo.value?.filepath,
        product,
      });
    }

    async function save() {
      if (loading.value) return;

      if (v$.value.$invalid) {
        v$.value.$touch();
        return;
      }

      await hideKeyboard();

      if (currentCategory.value.value === -1) {
        await toast({ message: "Please, select a category", duration: 1500 });
        return;
      }

      await productsStore.action(ActionType.products.setLoading, true);
      //Check if the product already exists on database.
      const productExists = await productApiClient.checkProduct(
        productId ? productId : state.name
      );

      if (productExists) {
        await productsStore.action(ActionType.products.setLoading, false);
        await toast({
          message: "This product already exists on database",
          duration: 2000,
        });

        return;
      }

      await addProduct(createProduct());

      await router.push({ name: "Products" });
    }

    currentCategory.value = { text: "Choose an option", value: -1 };

    categories.splice(0, 1);
    return {
      state,
      loading,
      v$,
      currentCategory,
      photo,
      router,
      categories,
      save,
      openCameraOptions,
    };
  },
});
</script>

<style></style>
