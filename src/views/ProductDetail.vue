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

      <ion-card v-else>
        <ion-card-content class="card card-content">
          <ion-img @click="openCameraOptions" :src="product.image"></ion-img>

          <ion-card-title class="text">
            {{ product.name }}
          </ion-card-title>
          <ion-card-subtitle class="text">
            {{ product.description }}
          </ion-card-subtitle>

          <ion-item>
            <ion-icon slot="start" :icon="icons.price"></ion-icon>
            <ion-label>{{ product.category }}</ion-label>
          </ion-item>

          <ion-item>
            <ion-label>{{ product.price }}</ion-label>
            <ion-icon slot="end" :icon="icons.euro"></ion-icon>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
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
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
    IonIcon,
    IonLabel,
    IonCardContent,
    IonImg,
    IonButton,
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
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text {
  margin: 0.6rem;
}
</style>
