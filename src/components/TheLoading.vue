<script lang="ts">
import { loadingController } from "@ionic/vue";
import { onUnmounted } from "vue";
export default {
  props: {
    message: {
      type: String,
      default: "Loading...",
    },
    animated: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  name: "TheLoading",
  async setup(props) {
    let loading;
    loadingController
      .create({
        cssClass: "my-custom-class",
        message: props.message,
        animated: props.animated,
        duration: props.duration,
      })
      .then( async l => {
     //  await l.present();
      });
  },
};
</script>
