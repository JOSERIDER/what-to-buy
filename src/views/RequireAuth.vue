<template>
  <ion-page>
    <ion-content>
      <div class="h-full flex flex-col space-y-4 justify-center items-center">
        <img
          class="rounded-full w-20 h-20 shadow"
          :src="require('@/assets/resources/user.png')"
          alt="user image"
        />
        <h2 class="text-center">Hi {{ user.name }}!</h2>

        <div class="flex flex-col justify-center">
          <VInput
            class="shadow"
            type="password"
            name="password"
            placeholder="Password"
            enterkeyhint="done"
            @enter="login"
            v-model:value="state.password"
            :v$="v$"
          />
          <ion-button @click="login" v-show="!v$.password.$invalid">
            LOGIN
          </ion-button>
          <div
            v-if="isAvailableFingerPrint"
            class="font-bold"
            @click="useTouchID"
          >
            Touch ID
          </div>
        </div>
      </div>
      <div
        @click="logout"
        class="bottom-4 absolute w-full text-center font-bold"
      >
        Logout ->
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import VInput from "@/components/ui/VInput";
import { IonButton, IonContent, IonPage } from "@ionic/vue";
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

export default {
  name: "RequireAuth",
  components: { VInput, IonPage, IonContent, IonButton },
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
        .catch(error => {
          console.log(error);
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
    };
  },
};
</script>

<style scoped></style>
