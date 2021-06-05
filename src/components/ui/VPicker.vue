<template>
  <div
    @click="openPicker"
    class="content flex justify-around rounded shadow items-center p-1"
  >
    <ion-label>{{ category.text }}</ion-label>
    <ion-icon :icon="caretDown" />
  </div>
</template>

<script>
import { IonIcon, IonLabel } from "@ionic/vue";
import { caretDown } from "ionicons/icons";
import useIonicService from "@/use/useIonicService";

export default {
  name: "VPicker",
  emits: ["categorySelected"],
  props: {
    category: {
      type: Object,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    columnName: {
      type: String,
      required: true,
    },
  },
  components: {
    IonLabel,
    IonIcon,
  },
  setup(props, { emit }) {
    const { picker } = useIonicService();
    let selectedIndex = 0;

    function openPicker() {
      selectedIndex = props.options.findIndex(
        i => i.value === props.category.value
      );
      picker({
        animated: true,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Choose",
            handler: val => {
              const value = val["Categories"];
              selectedIndex = props.options.findIndex(
                i => i.value === value.value
              );
              emit("categorySelected", value);
              return true;
            },
          },
        ],
        columns: [
          {
            name: props.columnName,
            selectedIndex: selectedIndex,
            options: props.options,
          },
        ],
      });
    }

    return { caretDown, openPicker };
  },
};
</script>

<style scoped>
.content:active {
  @apply shadow-inner;
}
</style>
