<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-menu-button slot="start"></ion-menu-button>
        <ion-title>Share</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="flex h-1/2 justify-center items-center">
        <qrcode-vue :value="user.qrUrl" :size="230"></qrcode-vue>
      </div>

      <div class="content h-1/2 shadow-inner p-4">
        <!-- Camera button -->
        <div
          @click="share"
          class="camera-button rounded-full w-12 p-2 m-auto shadow-lg"
        >
          <img
            class="w-full"
            :src="require('@/assets/resources/share.svg')"
            alt="camera"
          />
        </div>

        <!-- Header -->
        <div class="flex justify-between">
          <div class="text-2xl font-bold">
            Scan shared list QR code
          </div>
        </div>

        <!-- Category -->
        <div class="flex flex-col pt-4 space-y-1">
          <div class="font-light">
            Ask someone to scan this code to join your shared list if they don't
            share this code.
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useUserStore } from "@/store/user";
import { User } from "@/models/domain/user";
import { SocialSharingModelInterface } from "@/models/modules/social-sharing";
import socialSharing from "@/module-client/social-sharing";
import QrcodeVue from "qrcode.vue";

export default defineComponent({
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonMenuButton,
    IonContent,
    IonPage,
    QrcodeVue,
  },
  name: "Share",
  setup() {
    const userStore = useUserStore();
    const sharePlugin: SocialSharingModelInterface = socialSharing;
    const user: User = userStore.state.user;

    function share() {
      sharePlugin.share(
        `This is the shared list code of ${user.name}.\nPaste the following code on WhatToBy App to join to list:\n\n${user.mySharedList}`
      );
    }

    return { user, share };
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
