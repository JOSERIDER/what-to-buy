import { UserMutationType } from "@/models/store/user/UserMutationType";
import { ListsMutationType } from "@/models/store/lists/ListsMutationType";
import { AuthMutationTypes } from "@/models/store/autn/AuthMutationTypes";
import { ListDetailMutationTypes } from "@/models/store/list-detail";
import { ProductsMutationTypes } from "@/models/store/products";
import { ProductsSelectionMutationTypes } from "@/models/store/products-selection";

/**
 * Is the main namespace that export and group the mutation type specific for each domain.
 */
export namespace MutationType {
  export const user = UserMutationType;
  export const lists = ListsMutationType;
  export const auth = AuthMutationTypes;
  export const listDetail = ListDetailMutationTypes;
  export const products = ProductsMutationTypes;
  export const productsSelection = ProductsSelectionMutationTypes;
  export const setFilterState = "setFilterState";
}
