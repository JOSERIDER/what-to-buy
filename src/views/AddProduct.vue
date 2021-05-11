<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Add product</ion-title>
        <ion-back-button
          slot="start"
          @click="goBack()"
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
                productImage
                  ? productImage
                  : require('@/assets/resources/file-image-icon.png')
              "
              @click="takePhotoCamera()"
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
              v-model:value="state.price"
              placeholder="price"
              :v$="v$.price"
            />
            <ion-button @click="save()" expand="block">
              Save
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
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import router from "@/router";
import VInput from "@/components/ui/VInput.vue";
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { maxLength, minLength, numeric, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import VTextarea from "@/components/ui/VTextarea.vue";
import useIonicService from "@/use/useIonicService";
import useCategory from "../use/useCategory";
import { usePhotoGallery, Photo } from "@/use/usePhotoGallery";

export default defineComponent({
  name: "AddProduct",
  components: {
    VTextarea,
    IonPage,
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
    VInput,
  },
  setup() {
    const { picker } = useIonicService();
    const { categories } = useCategory();
    const { takePhotoCamera, takePhotoGallery, photos } = usePhotoGallery();
    const currentCategory = ref({} as any);
    const state = reactive({
      name: "",
      description: "",
      category: "",
      price: "",
    });

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

    const productImage = ref("");

    const v$ = useVuelidate(rules, state);

    function goBack() {
      router.go(-1);
    }

    function save() {
      if (v$.value.$invalid) {
        v$.value.$touch();
      }
      //TODO
    }

    watch(photos, photo => {
      console.log(photo);
    });

    currentCategory.value = { text: "Choose an option" };

    return {
      state,
      v$,
      productImage,
      currentCategory,
      goBack,
      save,
      takePhotoCamera,
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
