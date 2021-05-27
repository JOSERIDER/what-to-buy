import { StorageClientInterface } from "@/models/storage/StorageClient.interface";
import userStorageClient from "@/storage-client/user";
import touchIdStorageClient from "@/storage-client/touchId";

const storageClient: StorageClientInterface = {
  user: userStorageClient,
  touchId: touchIdStorageClient,
};

export default storageClient;
