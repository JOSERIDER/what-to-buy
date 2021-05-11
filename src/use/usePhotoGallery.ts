import { ref, onMounted, watch } from "vue";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  CameraPhoto,
  Capacitor,
  FilesystemDirectory,
} from "@capacitor/core";

export interface Photo {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {
  const { Camera } = Plugins;
  const photos = ref<Photo[]>([]);

  function savePhoto(cameraPhoto) {
    const fileName = new Date().getTime() + ".jpeg";
    const savedFileImage = {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
    };

    photos.value = [savedFileImage, ...photos.value];
  }

  const takePhotoCamera = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100,
    });
    savePhoto(cameraPhoto);
  };

  const takePhotoGallery = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100,
    });

    savePhoto(cameraPhoto);
  };

  return {
    photos,
    takePhotoCamera,
    takePhotoGallery,
  };
}
