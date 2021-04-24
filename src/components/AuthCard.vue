<template>
  <div class="h-full">
    <div class="flexbox relative z-10 cardStyle cardBackground">
      <form @submit.prevent="$emit(buttonEnabled ? 'submit' : '')">
        <slot name="form"></slot>
        <ion-button
          type="submit"
          class="btn btn-login"
          expand="block"
          shape="round"
        >
          <slot name="button-text"></slot>
        </ion-button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { IonButton } from "@ionic/vue";

export default {
  emits: ["submit"],
  components: {
    IonButton,
  },
  props: {
    buttonEnabled: Boolean,
  },
  name: "AuthCard",
};
</script>

<style scoped>
@import "../assets/style/auth.css";

.flexbox {
  width: 90vw;
}

.text ion-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
</style>
