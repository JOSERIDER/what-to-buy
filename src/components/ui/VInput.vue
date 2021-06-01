<template>
  <ion-row class="items-baseline">
    <ion-col v-if="icon" size="1" class="mx-4">
      <ion-icon :icon="icon"></ion-icon>
    </ion-col>
    <ion-col>
      <ion-input
        :disabled="disabled"
        :name="name"
        :ref="name"
        @change="v$.$touch()"
        :value="value"
        :enterkeyhint="enterkeyhint"
        :inputmode="inputMode"
        :clear-input="clearInput"
        :step="step"
        @keypress.enter="$emit('enter')"
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
<script>
import { IonCol, IonIcon, IonInput, IonRow } from "@ionic/vue";

export default {
  name: "VInput",
  emits: ["update:value", "enter"],
  methods: {
    setFocus() {
      this.$refs[this.name].$el.setFocus();
    },
  },
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
    enterkeyhint: {
      type: String,
      default: undefined,
    },
    inputMode: {
      type: String,
      default: undefined,
    },
    clearInput: {
      type: Boolean,
      default: false,
    },
    reference: {
      type: String,
      default: "",
    },
    step: {
      type: String,
      default: "",
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
