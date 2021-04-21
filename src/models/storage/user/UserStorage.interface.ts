import { User } from "@/models/Users";

/**
 * Interface to wrap storage methods of user.
 */
export interface UserStorageInterface {
  /**
   * Obtain user object from local storage is returned as promise.
   * @return User as promise.
   */
  get(): Promise<User>;

  /**
   * Set a certain user into local storage.
   * @param user - Is the user object to be inserted.
   * @return User as promise.
   */
  set(user: User): Promise<User>;

  /**
   * Remove user from local storage.
   */
  remove(): Promise<void>;
}
