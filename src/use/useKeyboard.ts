import { Plugins } from "@capacitor/core";

export function useKeyboard() {
  const { Keyboard } = Plugins;
  async function showKeyboard() {
    await Keyboard.show();
  }

  async function hideKeyboard() {
    await Keyboard.hide();
  }

  return { showKeyboard, hideKeyboard };
}
