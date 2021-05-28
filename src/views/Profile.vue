<template>
  <IonPage>
    <ion-header>
      <ion-toolbar>
        <ion-menu-button slot="start"> </ion-menu-button>
        <ion-title>My Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="h-full px-4">
        <div class="flex flex-col justify-center main items-center">
          <div class="m-4">
            <ion-avatar @click="openCameraOptions()">
              <img
                v-if="photo"
                class="avatar"
                :src="photo.webviewPath"
                alt="user profile image"
              />
              <img
                v-else
                class="avatar"
                :src="
                  user?.image
                    ? user.image
                    : require('@/assets/resources/user.png')
                "
                alt="user profile image"
              />
            </ion-avatar>
          </div>
          <div>
            <ion-text>
              <ion-label>{{ user.name }}</ion-label>
            </ion-text>
          </div>
        </div>

        <div class="flex flex-col">
          <ion-item-group>
            <ion-item-divider>
              <ion-label>Personal data</ion-label>
              <ion-icon
                slot="end"
                size="large"
                color="primary"
                :icon="editing ? icons.closeOutline : icons.create"
                @click="editing ? close() : (editing = true)"
              ></ion-icon>
            </ion-item-divider>
            <ion-item>
              <ion-label>Name</ion-label>
              <VInput
                v-if="editing"
                slot="end"
                :v$="v$.userName"
                v-model:value="v$.userName.$model"
                name="name"
              />
              <VInput
                v-else
                slot="end"
                :v$="v$.userName"
                :value="state.userName"
                :disabled="true"
                name="name"
              />
            </ion-item>
            <ion-item>
              <ion-label>Email</ion-label>
              <VInput
                v-if="editing"
                slot="end"
                :v$="v$.email"
                v-model:value="v$.email.$model"
                name="email"
              />
              <VInput
                v-else
                slot="end"
                :v$="v$.email"
                :value="state.email"
                :disabled="true"
                name="email"
              />
            </ion-item>
            <ion-item>
              <ion-label>Private lists</ion-label>
              <ion-label slot="end" class="ion-text-end">
                {{ privateLists }}
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Touch ID</ion-label>
              <ion-toggle
                slot="end"
                v-if="isEnabledFingerPrint"
                @ionChange="toggleFingerPrint($event.target.value)"
                :disabled="!isAvailableFingerPrint"
                checked
              />
              <ion-toggle
                slot="end"
                v-else
                @ionChange="toggleFingerPrint($event.target.value)"
                :disabled="!isAvailableFingerPrint"
                :checked="false"
              />
            </ion-item>
          </ion-item-group>
        </div>
        <div v-if="editing" class="flex justify-center mt-4">
          <ion-button @click="updateUser()">
            Update user
          </ion-button>
        </div>
      </div>
    </ion-content>
  </IonPage>
</template>

<script>
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/vue";
import VInput from "@/components/ui/VInput.vue";
import { useUserStore } from "@/store/user";
import { computed, reactive, ref, watch } from "vue";
import { create, closeOutline } from "ionicons/icons";
import { email, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useListsStore } from "@/store/lists";
import { ActionType } from "@/models/store";
import { useAuthsStore } from "@/store/auth";
import useIonicService from "@/use/useIonicService";
import { usePhotoGallery } from "@/use/usePhotoGallery";
import touchID from "@/module-client/touchID";
import touchIdStorageClient from "@/storage-client/touchId";

export default {
  name: "Profile",
  components: {
    VInput,
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonText,
    IonItemGroup,
    IonItem,
    IonItemDivider,
    IonMenuButton,
    IonAvatar,
    IonLabel,
    IonButton,
    IonToggle,
  },
  setup() {
    const userStore = useUserStore();
    const editing = ref(false);
    const privateListsStore = useListsStore();
    const { alert, toast, actionSheet } = useIonicService();
    const { takePhotoCamera, selectFromGallery, photo } = usePhotoGallery();
    const authStore = useAuthsStore();

    const user = computed(() => {
      return userStore.state.user;
    });

    const error = computed(() => {
      return userStore.state.error;
    });

    const isAvailableFingerPrint = ref(false);

    const isEnabledFingerPrint = ref(false);

    const state = reactive({
      email: user.value.email,
      userName: user.value.name,
    });

    const privateLists = computed(() => {
      return privateListsStore.state.lists.length;
    });

    const rules = computed(() => {
      return {
        email: {
          required,
          email,
        },
        userName: {
          required,
          minLength: minLength(4),
        },
      };
    });

    const v$ = useVuelidate(rules, state);

    function updateImageProfile() {
      userStore.action(ActionType.user.updateUserProfileImage, {
        base64Data: photo.value?.base64Data,
        fileName: photo.value?.filepath,
        userId: user.value.id,
      });
    }

    function openCameraOptions() {
      actionSheet({
        header: "Photo source",
        buttons: [
          {
            text: "Take picture",
            handler: async () => {
              await takePhotoCamera();
              updateImageProfile();
            },
          },
          {
            text: "Select from gallery",
            handler: async () => {
              await selectFromGallery();
              updateImageProfile();
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      });
    }

    function close() {
      editing.value = false;
      state.userName = user.value.name;
      state.email = user.value.email;
    }

    function showAuthAlert() {
      alert({
        header: "Authentication is required",
        message:
          "This operation require authentication, please type your current password.",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => close(),
          },
          {
            text: "Send",
            handler: async val => {
              await authStore.action(ActionType.auth.login, {
                email: user.value.email,
                password: val.Password,
              });
              if (authStore.state.error) {
                await alert({
                  header: "Something went wrong",
                  message: authStore.state.error,
                  buttons: [
                    {
                      text: "Cancel",
                      role: "cancel",
                      handler: () => close(),
                    },
                    {
                      text: "Try again",
                      handler: () => showAuthAlert(),
                    },
                  ],
                });
                return;
              }
              //Restore password again.
              await userStore.action(ActionType.user.updateUser, {
                id: user.value.id,
                name: state.userName,
                email: state.email,
              });
            },
          },
        ],
        inputs: [
          {
            name: "Password",
            type: "password",
            placeholder: "Password",
          },
        ],
      });
    }

    async function updateUser() {
      if (v$.value.$invalid) return;

      await userStore
        .action(ActionType.user.updateUser, {
          id: user.value.id,
          name: state.userName,
          email: state.email,
        })
        .catch(error => {
          if (error === "require-login") {
            showAuthAlert();
            return;
          }
          close();
        });
      editing.value = false;
    }

    async function toggleFingerPrint() {
      isEnabledFingerPrint.value = !isEnabledFingerPrint.value;
      await touchIdStorageClient.set(isEnabledFingerPrint.value ? true : null);
    }

    watch(error, error => {
      if (error) {
        toast({ message: error, duration: 2000 });
      }
    });

    function requestTouchId() {
      touchIdStorageClient.get().then(isEnabled => {
        isEnabledFingerPrint.value = isEnabled === true;
      });

      touchID
        .isAvailable()
        .then(() => (isAvailableFingerPrint.value = true))
        .catch(() => (isAvailableFingerPrint.value = false));
    }

    requestTouchId();

    return {
      v$,
      state,
      user,
      editing,
      privateLists,
      photo,
      openCameraOptions,
      toggleFingerPrint,
      updateUser,
      close,
      isEnabledFingerPrint,
      isAvailableFingerPrint,
      icons: {
        create,
        closeOutline,
      },
    };
  },
};
</script>

<style scoped>
ion-icon {
  font-size: 2rem;
}
.avatar {
  width: 9rem !important;
}
</style>
