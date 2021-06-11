import { Storage } from "@ionic/storage";
import { TouchIdStorageInterface } from "./TouchIdStorage.interface";
import { TouchIdStorageKeysInterface } from "@/models/storage/touchID/TouchIdStorageKeys.interface";

/**
 * Model class to wrap user storage actions that implements UserStorageInterface.
 * @implements UserStorageInterface.
 */
export class TouchIdStorageImp implements TouchIdStorageInterface {
  private readonly keysInterface: TouchIdStorageKeysInterface;
  private storage: Promise<Storage>;
  constructor(userKeys: TouchIdStorageKeysInterface) {
    this.keysInterface = userKeys;
    this.storage = new Storage().create();
  }

  get(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.then(storage => {
        storage
          .get(this.keysInterface.touchId)
          .then(response => {
            resolve(response);
          })
          .catch(error => reject(error));
      });
    });
  }

  remove(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.then(storage => {
        storage
          .remove(this.keysInterface.touchId)
          .then(() => resolve())
          .catch(error => reject(error));
      });
    });
  }

  set(isSet: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.then(storage => {
        storage
          .set(this.keysInterface.touchId, isSet)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }
}
