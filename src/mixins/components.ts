import { loadingController } from "@ionic/vue";

export default function() {
  async function createLoading(message: string) {
    return await loadingController.create({
      cssClass: "my-custom-class",
      message,
    });
  }

  return { loading: createLoading };
}
