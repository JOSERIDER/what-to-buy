import {
  actionSheetController,
  alertController,
  pickerController,
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

  async function alert({ header, buttons, message, inputs }) {
    const alert = await alertController.create({
      header,
      message,
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

  async function picker({ animated, buttons, columns }) {
    const picker = await pickerController.create({
      animated,
      buttons,
      columns,
      cssClass: "picker-hours",
    });
    picker.columns[0].options.forEach(element => {
      delete element.selected;
      delete element.duration;
      delete element.transform;
    });

    await picker.present();
  }

  return { popover, actionSheet, alert, toast, picker };
}
