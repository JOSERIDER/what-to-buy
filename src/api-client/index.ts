import { ApiClientInterface } from "@/models/api-client/ApiClient.interface";
import usersApiClient from "@/api-client/users";
import productsApiClient from "@/api-client/Products";
import sharedListsApiClient from "@/api-client/SharedLists";
import privateListsApiClient from "@/api-client/PrivateLists";
import { auth } from "@/models/http-client/client/firebase.config";
import productsSelectionApiClient from "@/api-client/productsSelection";

const apiClient: ApiClientInterface = {
  users: usersApiClient,
  products: productsApiClient,
  sharedLists: sharedListsApiClient,
  privateLists: privateListsApiClient,
  productsSelection: productsSelectionApiClient,
};

export default apiClient;

export const firebaseAuth = auth;
