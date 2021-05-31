<template>
  <ion-row class="items-baseline">
    <ion-col v-if="icon" size="1" class="mx-4">
      <ion-icon :icon="icon"></ion-icon>
    </ion-col>
    <ion-col>
      <ion-textarea
        :name="name"
        :ref="name"
        @change="v$.$touch()"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
        :enterkeyhint="enterkeyhint"
        :inputmode="inputMode"
        :clear-input="clearInput"
        @keypress.enter="$emit('enter')"
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
<script>
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
  },
  methods: {
    setFocus() {
      this.$refs[this.name].$el.setFocus();
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
