import { UserStorageInterface } from "@/models/storage/user/UserStorage.interface";
import { Storage } from "@ionic/storage";
import { UserStorageKeysInterface } from "@/models/storage/user/UserStorageKeys.interface";
import { User } from "@/models/domain/user";

/**
 * Model class to wrap user storage actions that implements UserStorageInterface.
 * @implements UserStorageInterface.
 */
export class UserStorageModel implements UserStorageInterface {
  private readonly userKeys: UserStorageKeysInterface;
  private storage: Promise<Storage>;
  constructor(userKeys: UserStorageKeysInterface) {
    this.userKeys = userKeys;
    this.storage = new Storage().create();
  }

  get(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.storage.then(storage => {
        storage
          .get(this.userKeys.user)
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
          .remove(this.userKeys.user)
          .then(() => resolve())
          .catch(error => reject(error));
      });
    });
  }

  set(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      this.storage.then(storage => {
        storage
          .set(this.userKeys.user, user)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }
}
