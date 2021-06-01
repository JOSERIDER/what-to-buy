<template>
  <ion-searchbar
    :placeholder="placeholder"
    :inputmode="inputmode"
    @ionChange="$emit('onSearchChange', $event)"
    @keypress.enter="$emit('enter')"
    :enterkeyhint="enterKeyhint"
  ></ion-searchbar>
</template>
<script lang="ts">
import { IonSearchbar } from "@ionic/vue";

export default {
  emits: ["onSearchChange", "enter"],
  name: "VSearchBar",
  components: {
    IonSearchbar,
  },
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    inputmode: {
      type: String,
      default: "",
    },
    enterKeyhint: {
      type: String,
      default: "",
    },
  },
};
</script>
