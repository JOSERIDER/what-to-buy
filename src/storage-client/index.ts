import { StorageClientInterface } from "@/models/storage/StorageClient.interface";
import userStorageClient from "@/storage-client/user";
import touchIdStorageClient from "@/storage-client/touchId";
import starterStorage from "@/storage-client/starter";

const storageClient: StorageClientInterface = {
  user: userStorageClient,
  touchId: touchIdStorageClient,
  starter: starterStorage,
};

export default storageClient;
