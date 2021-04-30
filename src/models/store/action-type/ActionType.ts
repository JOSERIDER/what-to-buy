import { UserActionTypes } from "@/models/store/user";
import { ListsActionTypes } from "@/models/store/lists";
import { AuthActionTypes } from "@/models/store/autn";
import { ListDetailActionTypes } from "@/models/store/list-detail";
import { ProductsActionTypes } from "@/models/store/products";

/**
 * Is the main namespace that export and group the action type specific for each domain.
 */
export namespace ActionType {
  export const user = UserActionTypes;
  export const lists = ListsActionTypes;
  export const auth = AuthActionTypes;
  export const listDetail = ListDetailActionTypes;
  export const products = ProductsActionTypes;
}
