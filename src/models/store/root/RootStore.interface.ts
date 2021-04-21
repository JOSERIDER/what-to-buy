import { UserStateInterface } from "@/models/store";
import { ListsStateInterface } from "@/models/store";
import { AuthStateInterface } from "@/models/store";

/**
 * @name RootStoreInterface
 * Interface to wrap all stores in one place.
 */
export interface RootStoreInterface {
  userState: UserStateInterface;
  listsState: ListsStateInterface;
  authState: AuthStateInterface;
}
