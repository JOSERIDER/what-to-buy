import { UserActionTypes } from "@/models/store/user/UserActionTypes";
import { ListsActionTypes } from "@/models/store/lists/ListsActionTypes";

/**
 * Is the main namespace that export and group the action type specific for each domain.
 */
export namespace ActionType {
  export const user = UserActionTypes;
  export const lists = ListsActionTypes;
}
