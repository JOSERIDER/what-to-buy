import {
  ListDetailStateInterface,
  ProductsSelectionStateInterface,
  UserStateInterface,
} from "@/models/store";
import { ListsStateInterface } from "@/models/store";
import { AuthStateInterface } from "@/models/store";
import { ProductsStateInterface } from "@/models/store/products";

/**
 * @name RootStoreInterface
 * Interface to wrap all stores in one place.
 */
export interface RootStoreInterface {
  userState: UserStateInterface;
  listsState: ListsStateInterface;
  authState: AuthStateInterface;
  listDetailState: ListDetailStateInterface;
  productsState: ProductsStateInterface;
  productsSelectionState: ProductsSelectionStateInterface;
}
