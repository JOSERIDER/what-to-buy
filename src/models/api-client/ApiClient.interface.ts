import { UsersApiClientModelInterface } from "./users";
import { ProductsApiClientModelInterface } from "@/models/api-client/Products";
import { PrivateListsApiClientModelInterface } from "@/models/api-client/PrivateLists";
import { SharedListsApiClientModelInterface } from "@/models/api-client/SharedLists";

/**
 * @Name ApiClientInterface
 * @Description interface that holds all api clients.
 */
export interface ApiClientInterface {
  users: UsersApiClientModelInterface;
  products: ProductsApiClientModelInterface;
  privateLists: PrivateListsApiClientModelInterface;
  sharedLists: SharedListsApiClientModelInterface;
}
