<template>
  <IonPage>
    <ion-header>
      <ion-toolbar>
        <ion-menu-button slot="start"> </ion-menu-button>
        <ion-title>My Profile</ion-title>
        <ion-button
          @click="openPopover($event)"
          fill="clear"
          slot="end"
          color="primary"
        >
          <ion-icon size="large" :icon="icons.ellipsis"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="h-full">
        <div class="flex flex-col h-1/3 justify-center main items-center">
          <div class="m-4">
            <img
              @click="openCameraOptions()"
              v-if="photo"
              class="w-24 h-24 rounded-full shadow"
              :src="photo.webviewPath"
              alt="user profile image"
            />
            <img
              v-else
              @click="openCameraOptions()"
              class="w-24 h-24 rounded-full shadow"
              :src="
                user?.image
                  ? user.image
                  : require('@/assets/resources/user.png')
              "
              alt="user profile image"
            />
          </div>
          <div></div>
        </div>

        <div
          class="content h-2/3 overflow-y-scroll absolute bottom-0 w-full shadow-inner p-2"
        >
          <!-- Header -->
          <div class="flex justify-between">
            <div class="text-xl m-2 font-bold">
              {{ user.name }}
            </div>
          </div>

          <!-- Category -->
          <div class="flex flex-col pt-4 space-y-1">
            <div class="font-light">
              <div class="flex flex-col">
                <ion-item-group class="space-y-0.5">
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
                  <ion-item lines="none" class="shadow rounded">
                    <ion-label slot="start" class="font-bold">Name</ion-label>
                    <VInput
                      class="text-right"
                      v-if="editing"
                      slot="end"
                      capitalize="words"
                      enterkeyhint="next"
                      @enter="$refs.userEmail.setFocus()"
                      :v$="v$.userName"
                      v-model:value="v$.userName.$model"
                      name="name"
                    />
                    <VInput
                      class="text-right"
                      v-else
                      slot="end"
                      :v$="v$.userName"
                      :value="state.userName"
                      :disabled="true"
                      name="name"
                    />
                  </ion-item>
                  <ion-item lines="none" class="shadow rounded">
                    <ion-label slot="start" class="font-bold">Email</ion-label>
                    <VInput
                      class="text-right"
                      v-if="editing"
                      slot="end"
                      ref="userEmail"
                      enterkeyhint="done"
                      @enter="updateUser"
                      :v$="v$.email"
                      v-model:value="v$.email.$model"
                      name="email"
                    />
                    <VInput
                      class="text-right"
                      v-else
                      slot="end"
                      :v$="v$.email"
                      :value="state.email"
                      :disabled="true"
                      name="email"
                    />
                  </ion-item>
                  <ion-item lines="none" class="shadow rounded">
                    <ion-label class="font-bold">Private lists</ion-label>
                    <ion-label slot="end" class="ion-text-end">
                      {{ privateLists }}
                    </ion-label>
                  </ion-item>
                  <ion-item lines="none" class="shadow rounded">
                    <ion-label class="font-bold">Touch ID</ion-label>
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
                <ion-button @click="updateUser">
                  Update user
                </ion-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </IonPage>
</template>

<script>
import {
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
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/vue";
import VInput from "@/components/ui/VInput.vue";
import { useUserStore } from "@/store/user";
import { computed, reactive, ref, watch } from "vue";
import { create, closeOutline, ellipsisVerticalOutline } from "ionicons/icons";
import { email, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useListsStore } from "@/store/lists";
import { ActionType } from "@/models/store";
import { useAuthsStore } from "@/store/auth";
import useIonicService from "@/use/useIonicService";
import { usePhotoGallery } from "@/use/usePhotoGallery";
import touchID from "@/module-client/touchID";
import touchIdStorageClient from "@/storage-client/touchId";
import { useKeyboard } from "@/use/useKeyboard";
import ProfileOptionsPopover from "@/components/profile/ProfileOptionsPopover";

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
    IonItemGroup,
    IonItem,
    IonItemDivider,
    IonMenuButton,
    IonLabel,
    IonButton,
    IonToggle,
  },
  setup() {
    const userStore = useUserStore();
    const editing = ref(false);
    const privateListsStore = useListsStore();
    const { alert, toast, actionSheet, popover } = useIonicService();
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

      await useKeyboard().hideKeyboard();

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

    function openPopover(event) {
      popover({
        event,
        component: ProfileOptionsPopover,
        componentProps: {},
        mode: "ios",
        translucent: "false",
      });
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
      openPopover,
      close,
      isEnabledFingerPrint,
      isAvailableFingerPrint,
      icons: {
        create,
        closeOutline,
        ellipsis: ellipsisVerticalOutline,
      },
    };
  },
};
</script>

<style scoped>
ion-icon {
  font-size: 2rem;
}

.content {
  -webkit-box-shadow: 0 0 28px -6px rgba(135, 135, 135, 1);
  -moz-box-shadow: 0 0 28px -6px rgba(135, 135, 135, 1);
  box-shadow: 0 0 28px -6px rgba(135, 135, 135, 1);
  border-radius: 25px 25px 0 0;
}
</style>
