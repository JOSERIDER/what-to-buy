<template>
  <ion-header>
    <ion-toolbar>
      <ion-menu-button slot="start"> </ion-menu-button>
      <ion-title>Share</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-card>
      <ion-card-header>
        <ion-card-title>Scan shared list QR code</ion-card-title>
      </ion-card-header>
      <ion-card-content class="flex justify-center items-center flex-col">
        <ion-img class="w-48 h-48" :src="user.qrUrl"></ion-img>
        <ion-card-subtitle class="ion-margin-vertical"
          >Ask someone to scan this code to join your shared list if they don't
          share this code.</ion-card-subtitle
        >
      </ion-card-content>
    </ion-card>
    <ion-button @click="share()" expand="block" fill="clear" shape="round">
      Share code
    </ion-button>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { useUserStore } from "@/store/user";
import { User } from "@/models/domain/user";

export default defineComponent({
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonMenuButton,
    IonContent,
    IonImg,
  },
  name: "Share",
  setup() {
    const userStore = useUserStore();
    const socialSharing: SocialSharing = new SocialSharing();
    const user: User = userStore.state.user;

    function share() {
      socialSharing.share(
        `This is the shared list code of ${user.name}.\nPaste the following code on WhatToBy App to join to list:\n\n${user.mySharedList}`
      );
    }

    return { user, share };
  },
});
</script>

<style scoped></style>
