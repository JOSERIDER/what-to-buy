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
      <ion-grid fixed class="form">
        <ion-row class="ion-justify-content-center">
          <ion-col size="6">
            <ion-img
              :src="
                photo
                  ? photo.webviewPath
                  : require('@/assets/resources/file-image-icon.png')
              "
              @click="openCameraOptions"
            ></ion-img>
          </ion-col>
        </ion-row>

        <ion-card class="flexbox ion-padding">
          <!-- name -->
          <form>
            <VInput
              name="productName"
              v-model:value="state.name"
              placeholder="Name of product"
              :v$="v$.name"
            />

            <!-- Description -->
            <VTextarea
              name="productDescription"
              v-model:value="state.description"
              placeholder="Description"
              :v$="v$.description"
            />

            <ion-grid @click="openPicker()">
              <ion-row class="justify-center">
                <ion-col>
                  <ion-label class="text-center">
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
            <!-- Price -->
            <VInput
              name="productPrice"
              v-model:value.number="state.price"
              placeholder="price"
              :v$="v$.price"
              type="number"
            />
            <ion-button v-if="!loading" @click="save()" expand="block">
              Save
            </ion-button>
            <ion-button v-else expand="block">
              <VSpinnerButtonLoading />
            </ion-button>
          </form>
        </ion-card>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import router from "@/router";
import VInput from "@/components/ui/VInput.vue";
import useVuelidate from "@vuelidate/core";
import VTextarea from "@/components/ui/VTextarea.vue";
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

export default defineComponent({
  name: "AddProduct",
  components: {
    VSpinnerButtonLoading,
    VTextarea,
    VInput,
    IonPage,
    IonLabel,
    IonContent,
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonGrid,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonImg,
  },
  setup() {
    const { picker, toast, actionSheet } = useIonicService();
    const { categories } = useCategory();
    const { takePhotoCamera, selectFromGallery, photo } = usePhotoGallery();
    const currentCategory = ref({} as any);
    const productsStore = useProductsStore();
    const productApiClient = apiClient.products;
    const state = reactive({
      name: "",
      description: "",
      category: "",
      price: -1,
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
      save,
      openCameraOptions,
      openPicker,
    };
  },
});
</script>

<style>
p {
  color: rgb(178, 178, 178);
}
</style>
