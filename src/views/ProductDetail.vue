<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-back-button
          slot="start"
          defaultHref="/"
          text="Back"
        ></ion-back-button>
        <ion-title>{{ product.name }}</ion-title>
        <ion-button @click="openModal" fill="clear" slot="end">
          <ion-icon size="large" :icon="icons.edit"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div
        v-if="!product"
        class="flex flex-row items-center h-full justify-center"
      >
        <VSpinner />
      </div>

      <div class="flex h-1/2 justify-center">
        <img class="w-60" :src="product.image" alt="products image" />
      </div>

      <div class="content h-1/2 shadow-inner p-4">
        <!-- Camera button -->
        <div
          @click="openCameraOptions"
          class="camera-button rounded-full w-12 p-2 m-auto shadow-lg"
        >
          <img
            class="w-full"
            :src="require('@/assets/resources/products/diaphragm.svg')"
            alt="camera"
          />
        </div>

        <!-- Header -->
        <div class="flex justify-between">
          <div class="text-2xl font-bold w-2/3">
            {{ product.name }}
          </div>
          <div class="font-bold text-xl">{{ product.price }} €</div>
        </div>

        <!-- Category -->
        <div class="flex flex-col pt-4 space-y-1">
          <p class="font-bold text-sm">Category</p>
          <div class="font-light">{{ product.category }}</div>
        </div>

        <!-- Description -->
        <div class="flex flex-col pt-4 space-y-1">
          <p class="font-bold text-sm">Description</p>
          <div class="font-light">{{ product.description }}</div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import apiClient from "@/api-client";
import { Product } from "@/models/domain/product";
import { logoEuro, pricetagsOutline } from "ionicons/icons";
import { createOutline } from "ionicons/icons";
import ProductDetailEditModal from "@/components/product-detail/ProductDetailEditModal.vue";
import VSpinner from "@/components/ui/VSpinner.vue";
import useIonicService from "@/use/useIonicService";
import { usePhotoGallery } from "@/use/usePhotoGallery";
import { storage } from "@/models/http-client/client/firebase.config";

export default defineComponent({
  name: "ProductDetail",
  components: {
    VSpinner,
    IonPage,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const productApiClient = apiClient.products;
    const product = ref({} as Product);
    const { actionSheet } = useIonicService();
    const { takePhotoCamera, selectFromGallery, photo } = usePhotoGallery();

    async function fetchProduct() {
      product.value = await productApiClient.get(props.id);
    }

    async function openModal() {
      const modal = await modalController.create({
        component: ProductDetailEditModal,
        componentProps: { product: product.value },
      });
      await modal.present();
      await modal.onDidDismiss().then(() => fetchProduct());
    }

    async function updateImage() {
      let productCopy = { ...product.value };
      const response = await storage("gs://shopping-list-93c19.appspot.com")
        .ref(photo.value?.filepath)
        .putString(photo.value?.base64Data!!, "data_url");

      productCopy.image = await response.ref.getDownloadURL();

      productCopy = JSON.parse(JSON.stringify(productCopy));

      await productApiClient.update(productCopy.id!!, productCopy);
      product.value = productCopy;
    }

    function openCameraOptions() {
      actionSheet({
        header: "Photo source",
        buttons: [
          {
            text: "Take picture",
            handler: async () => {
              await takePhotoCamera();
              updateImage();
            },
          },
          {
            text: "Select from gallery",
            handler: async () => {
              await selectFromGallery();
              updateImage();
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      });
    }

    fetchProduct();

    return {
      product,
      openModal,
      openCameraOptions,
      icons: { euro: logoEuro, price: pricetagsOutline, edit: createOutline },
    };
  },
});
</script>

<style scoped>
.camera-button {
  position: relative;
  top: -35px;
  background-color: #ffc409;
}
.camera-button:active {
  @apply shadow-inner;
}
.content {
  -webkit-box-shadow: 0 0 28px -6px rgba(135, 135, 135, 1);
  -moz-box-shadow: 0 0 28px -6px rgba(135, 135, 135, 1);
  box-shadow: 0 0 28px -6px rgba(135, 135, 135, 1);
  border-radius: 25px 25px 0 0;
}
</style>
