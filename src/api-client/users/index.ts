import {
  UsersApiClientModel,
  UsersApiClientModelInterface,
  UsersApiClientUrlInterface,
} from "@/models/api-client/users";

const urls: UsersApiClientUrlInterface = {
  users: "usuarios",
};

const usersApiClient: UsersApiClientModelInterface = new UsersApiClientModel(
  urls
);

export default usersApiClient;
