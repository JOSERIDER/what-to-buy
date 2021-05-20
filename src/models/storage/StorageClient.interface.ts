import { UserStorageInterface } from "@/models/storage/user";

/**
 * Interface to hold all storage clients.
 */
export interface StorageClientInterface {
  user: UserStorageInterface;
}
