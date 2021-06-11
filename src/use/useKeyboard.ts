import { Plugins } from "@capacitor/core";
import { getPlatforms } from "@ionic/vue";

export function useKeyboard() {
  const { Keyboard } = Plugins;
  async function showKeyboard() {
    if (
      !getPlatforms().includes("cordova") ||
      !getPlatforms().includes("capacitor")
    ) {
      return;
    }
    await Keyboard.show();
  }

  async function hideKeyboard() {
    if (
      !getPlatforms().includes("cordova") ||
      !getPlatforms().includes("capacitor")
    ) {
      return;
    }
    await Keyboard.hide();
  }

  return { showKeyboard, hideKeyboard };
}
