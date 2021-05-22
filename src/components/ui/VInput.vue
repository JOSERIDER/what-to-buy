<template>
  <ion-row class="items-baseline">
    <ion-col v-if="icon" size="1" class="mx-4">
      <ion-icon :icon="icon"></ion-icon>
    </ion-col>
    <ion-col>
      <ion-input
        :disabled="disabled"
        :name="name"
        @change="v$.$touch()"
        :value="value"
        @ionInput="$emit('update:value', $event.target.value)"
        :class="{
          invalid: v$.$invalid && v$.$dirty,
          border: border,
        }"
        :placeholder="placeholder"
        :type="type"
      >
      </ion-input>
    </ion-col>
  </ion-row>
</template>
<script lang="ts">
import { IonCol, IonIcon, IonInput, IonRow } from "@ionic/vue";

export default {
  name: "VInput",
  emits: ["update:value"],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    value: {
      required: true,
    },
    v$: {
      type: Object,
      required: false,
    },
    icon: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    name: {
      type: String,
      required: true,
    },
  },
  components: {
    IonCol,
    IonIcon,
    IonInput,
    IonRow,
  },
};
</script>
