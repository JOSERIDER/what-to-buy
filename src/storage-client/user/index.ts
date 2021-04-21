import { UserStorageInterface, UserStorageModel } from "@/models/storage/user";
import { UserStorageKeysInterface } from "@/models/storage/user/UserStorageKeys.interface";

const userKeys: UserStorageKeysInterface = {
  user: "USER_STORAGE",
};

const userStorageClient: UserStorageInterface = new UserStorageModel(userKeys);

export default userStorageClient;
