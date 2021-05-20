import { StorageClientInterface } from "@/models/storage/StorageClient.interface";
import userStorageClient from "@/storage-client/user";

const storageClient: StorageClientInterface = {
  user: userStorageClient,
};

export default storageClient;
