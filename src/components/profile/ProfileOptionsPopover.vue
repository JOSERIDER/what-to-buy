<template>
  <ion-content>
    <ion-item-group class="space-y-0.5 p-1">
      <ion-item
        class="shadow rounded"
        lines="none"
        @click="logout"
        button
        :detail="true"
      >
        <ion-icon color="danger" slot="start" :icon="logOutOutline"></ion-icon>
        <ion-label>Logout</ion-label>
      </ion-item>
      <ion-item
        class="shadow rounded"
        lines="none"
        button
        @click="deleteAccount"
        :detail="true"
      >
        <ion-icon
          color="danger"
          slot="start"
          :icon="removeCircleOutline"
        ></ion-icon>
        <ion-label>
          Delete
          <br />
          account
        </ion-label>
      </ion-item>
    </ion-item-group>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  popoverController,
} from "@ionic/vue";
import { removeCircleOutline, logOutOutline } from "ionicons/icons";
import useLogout from "@/use/useLogout";
import useIonicService from "@/use/useIonicService";

export default {
  name: "ProfileOptionsPopover",
  components: {
    IonContent,
    IonItemGroup,
    IonItem,
    IonIcon,
    IonLabel,
  },
  data() {
    return {
      logOutOutline,
      removeCircleOutline,
    };
  },
  methods: {
    async logout() {
      await this.showAlert(
        "Good bye!",
        "You will close your active session, Are you sure ?",
        async () => {
          await useLogout().logout();
          await popoverController.dismiss();
        }
      );
    },
    async deleteAccount() {
      await this.showAlert(
        "Are you sure ?",
        "You will delete your account and all your lists.",
        async () => {
          await popoverController.dismiss();
          await useLogout().deleteAccount();
        }
      );
    },
    async showAlert(header, message, handler) {
      await useIonicService().alert({
        header,
        message,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Continue",
            handler,
          },
        ],
        inputs: [],
      });
    },
  },
};
</script>

<style scoped></style>
