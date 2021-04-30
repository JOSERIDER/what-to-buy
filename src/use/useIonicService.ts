import {
  actionSheetController,
  alertController,
  popoverController,
  toastController,
} from "@ionic/vue";

export default function useIonicService() {
  async function popover({
    event,
    component,
    componentProps,
    mode,
    translucent,
  }) {
    const popover = await popoverController.create({
      component,
      componentProps,
      event,
      mode,
      translucent,
    });
    await popover.present();
  }

  async function actionSheet({ header, buttons }) {
    const actionSheet = await actionSheetController.create({
      header,
      buttons,
    });
    await actionSheet.present();
  }

  async function alert({ header, buttons, inputs }) {
    const alert = await alertController.create({
      header,
      inputs,
      buttons,
    });
    await alert.present();
  }

  async function toast({ message, duration }) {
    const toast = await toastController.create({
      message,
      duration,
    });
    await toast.present();
  }

  return { popover, actionSheet, alert, toast };
}
