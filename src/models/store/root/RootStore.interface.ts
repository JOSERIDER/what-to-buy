import { UserStateInterface } from "@/models/store/user/UserState.interface";
import { ListsStateInterface } from "@/models/store";

/**
 * @name RootStoreInterface
 * Interface to wrap all stores in one place.
 */
export interface RootStoreInterface {
  userState: UserStateInterface;
  listsState: ListsStateInterface;
}
