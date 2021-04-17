import {
  SharedListApiClientModel,
  SharedListsApiClientModelInterface,
  SharedListsApiClientUrlInterface,
} from "@/models/api-client/SharedLists";

const urls: SharedListsApiClientUrlInterface = {
  sharedLists: "sharedList",
};

const sharedListsApiClient: SharedListsApiClientModelInterface = new SharedListApiClientModel(
  urls
);

export default sharedListsApiClient;
