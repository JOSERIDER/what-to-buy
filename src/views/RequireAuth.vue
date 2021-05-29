<template>
  <ion-page>
    <ion-content>
      <div class="h-full flex flex-col space-y-4 justify-center items-center">
        <img
          class="rounded-full w-20 h-20 shadow"
          :src="require('@/assets/resources/user.png')"
        />
        <h2 class="text-center">Hi {{ user.name }}!</h2>
        <VInput
          class="shadow"
          type="password"
          name="password"
          placeholder="Password"
          v-model:value="state.password"
          :v$="v$"
        />
        <div
          v-if="isAvailableFingerPrint"
          class="font-bold"
          @click="useTouchID"
        >
          Touch ID
        </div>
        <ion-button @click="login" v-if="!v$.$invalid">
          LOGIN
        </ion-button>
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
import { IonContent, IonPage } from "@ionic/vue";
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

export default {
  name: "RequireAuth",
  components: { VInput, IonPage, IonContent },
  setup() {
    const userStore = useUserStore();
    const authStore = useAuthsStore();
    const { alert, toast } = useIonicService();
    const { logout } = useLogout();

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

    const v$ = useVuelidate(rules, state);

    const user = computed(() => {
      return userStore.state.user;
    });

    async function showAlert() {
      await alert({
        header: "Something went wrong",
        message: authStore.state.error,
        buttons: ["OK"],
      });
    }

    async function login() {
      const userData = { email: user.value.email, password: state.password };
      await authStore.action(ActionType.auth.login, userData);
      if (authStore.state.error) {
        await showAlert();
        return;
      }
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
