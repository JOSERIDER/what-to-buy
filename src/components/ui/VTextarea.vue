<template>
  <ion-row class="items-baseline">
    <ion-col v-if="icon" size="1" class="mx-4">
      <ion-icon :icon="icon"></ion-icon>
    </ion-col>
    <ion-col>
      <ion-textarea
        :name="name"
        @change="v$.$touch()"
        @input="$emit('update:value', $event.target.value)"
        :class="{
          invalid: v$.$invalid && v$.$dirty,
          border: border,
        }"
        :placeholder="placeholder"
        :type="type"
      >
      </ion-textarea>
    </ion-col>
  </ion-row>
</template>
<script lang="ts">
import { IonCol, IonIcon, IonRow, IonTextarea } from "@ionic/vue";

export default {
  name: "VTextarea",
  emits: ["update:value"],
  props: {
    border: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
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
    IonTextarea,
    IonRow,
  },
};
</script>
