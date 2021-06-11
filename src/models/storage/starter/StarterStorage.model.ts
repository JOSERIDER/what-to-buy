import { StarterStorageInterface } from "@/models/storage/starter/StarterStorage.interface";
import { Storage } from "@ionic/storage";
import { StarterStorageKeysInterface } from "@/models/storage/starter/StarterStorageKeys.interface";

export class StarterStorageImp implements StarterStorageInterface {
  private readonly keysInterface: StarterStorageKeysInterface;
  private storage: Promise<Storage>;

  constructor(keysInterface: StarterStorageKeysInterface) {
    this.keysInterface = keysInterface;
    this.storage = new Storage().create();
  }

  get(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.then(storage => {
        storage
          .get(this.keysInterface.isSet)
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
          .remove(this.keysInterface.isSet)
          .then(() => resolve())
          .catch(error => reject(error));
      });
    });
  }

  set(isSet: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.then(storage => {
        storage
          .set(this.keysInterface.isSet, isSet)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }
}
