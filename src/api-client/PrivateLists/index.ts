import {
  PrivateListsApiClientModel,
  PrivateListsApiClientModelInterface,
  PrivateListsApiClientUrlInterface,
} from "@/models/api-client/PrivateLists";

const urls: PrivateListsApiClientUrlInterface = {
  privateLists: "privateList",
};

const privateListsApiClient: PrivateListsApiClientModelInterface = new PrivateListsApiClientModel(
  urls
);

export default privateListsApiClient;
