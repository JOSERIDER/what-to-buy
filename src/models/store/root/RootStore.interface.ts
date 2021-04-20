import { UserStateInterface } from "@/models/store/user/UserState.interface";

/**
 * @name RootStoreInterface
 * Interface to wrap all stores in one place.
 */
export interface RootStoreInterface {
  userProfileState: UserStateInterface;
}
