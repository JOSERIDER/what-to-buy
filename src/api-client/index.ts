import { ApiClientInterface } from "@/models/api-client/ApiClient.interface";
import usersApiClient from "@/api-client/users";
import productsApiClient from "@/api-client/Products";
import sharedListsApiClient from "@/api-client/SharedLists";
import privateListsApiClient from "@/api-client/PrivateLists";

const apiClient: ApiClientInterface = {
  users: usersApiClient,
  products: productsApiClient,
  sharedLists: sharedListsApiClient,
  privateLists: privateListsApiClient,
};

export default apiClient;
