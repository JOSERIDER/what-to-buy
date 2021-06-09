<template>
  <ion-page>
    <ion-content>
      <div
        class="h-full flex flex-col space-y-4 justify-center items-center p-10"
      >
        <img
          class="rounded-full w-20 h-20 shadow"
          :src="
            user.image ? user.image : require('@/assets/resources/user.png')
          "
          alt="user image"
        />
        <h2 class="text-center">Hi {{ user.name }}!</h2>

        <div class="flex flex-col w-full justify-center space-y-4">
          <VInput
            class="shadow rounded-full"
            type="password"
            name="password"
            placeholder="Password"
            enterkeyhint="done"
            @enter="login"
            v-model:value="state.password"
            :v$="v$"
          />
          <ion-button
            @click="login"
            expand="block"
            shape="round"
            v-show="!v$.password.$invalid"
          >
            Login
          </ion-button>
          <ion-button
            @click="useTouchID"
            color="secondary"
            expand="block"
            shape="round"
            size="small"
            v-show="isAvailableFingerPrint"
          >
            <ion-icon class="mr-2" :icon="fingerPrint" /> Touch ID
          </ion-button>
        </div>
        <ion-button
          @click="logout"
          expand="clear"
          mode="ios"
          class="logout bottom-4 absolute w-full text-center font-bold"
        >
          Logout <ion-icon class="ml-2" :icon="logOutOutline" />
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import VInput from "@/components/ui/VInput";
import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/vue";
import { useUserStore } from "@/store/user";
import { useAuthsStore } from "@/store/auth";
import { computed, reactive, ref } from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { ActionType } from "@/models/store";
import useIonicService from "@/use/useIonicService";
import router from "@/router";
import touchID from "@/module-client/touchID";
import touchIdStorageClient from "@/storage-client/touchId";
import useLogout from "@/use/useLogout";
import { useKeyboard } from "@/use/useKeyboard";
import { fingerPrint, logOutOutline } from "ionicons/icons";

export default {
  name: "RequireAuth",
  components: { VInput, IonPage, IonContent, IonButton, IonIcon },
  setup() {
    const userStore = useUserStore();
    const authStore = useAuthsStore();
    const { alert, toast, loadingController } = useIonicService();
    const { logout } = useLogout();
    const { hideKeyboard } = useKeyboard();
    const loggedIn = ref(false);
    let lc;
    const isAvailableFingerPrint = ref(false);

    const isEnabledFingerPrint = ref(false);

    const state = reactive({
      password: "",
    });

    const rules = computed(() => {
      return {
        password: {
          required,
        },
      };
    });

    const loading = computed(() => {
      return authStore.state.loading;
    });

    const v$ = useVuelidate(rules, state);

    const user = computed(() => {
      return userStore.state.user;
    });

    async function showLoading() {
      lc = await loadingController({
        spinner: "lines",
        message: "Loading...",
      });
    }

    async function showAlert() {
      await alert({
        header: "Something went wrong",
        message: authStore.state.error,
        buttons: ["OK"],
      });
    }

    async function login() {
      await showLoading();
      await hideKeyboard();
      const userData = { email: user.value.email, password: state.password };
      await authStore.action(ActionType.auth.login, userData);
      if (authStore.state.error) {
        await lc.dismiss();
        await showAlert();
        return;
      }
      await lc.dismiss();
      await router.push({ name: "Dashboard" });
    }

    function useTouchID() {
      touchID
        .show()
        .then(async () => {
          await router.push({ name: "Dashboard" });
        })
        .catch(() => {
          toast({
            message: "Too many attempts, please insert your password",
            duration: 2000,
          });
        });
    }

    function requestTouchId() {
      touchID
        .isAvailable()
        .then(async () => {
          isAvailableFingerPrint.value = true;
          const isEnabled = await touchIdStorageClient.get();
          isEnabledFingerPrint.value = isEnabled === true;
          if (isEnabled === true) {
            useTouchID();
          }
        })
        .catch(() => (isAvailableFingerPrint.value = false));
    }

    requestTouchId();

    return {
      user,
      state,
      loading,
      loggedIn,
      v$,
      isAvailableFingerPrint,
      login,
      logout,
      useTouchID,
      fingerPrint,
      logOutOutline,
    };
  },
};
</script>
