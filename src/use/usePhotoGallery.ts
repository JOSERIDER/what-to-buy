import { ref } from "vue";
import {
  CameraPhoto,
  CameraResultType,
  CameraSource,
  Plugins,
} from "@capacitor/core";
export interface Photo {
  filepath: string;
  webviewPath?: string;
  base64Data?: string;
}

export function usePhotoGallery() {
  const { Camera } = Plugins;
  const photo = ref<Photo>();

  function createPath(): string {
    return `images/user_image_${new Date().getTime()}.jpg`;
  }

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  const savePicture = async (photo: CameraPhoto): Promise<Photo> => {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = (await convertBlobToBase64(blob)) as string;
    const fileName = createPath();

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
      base64Data,
    };
  };

  const takePhotoCamera = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 50,
    });

    photo.value = await savePicture(cameraPhoto);
  };

  const selectFromGallery = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 50,
    });

    photo.value = await savePicture(cameraPhoto);
  };

  return {
    photo,
    takePhotoCamera,
    selectFromGallery,
  };
}
