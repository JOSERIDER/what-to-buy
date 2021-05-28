import { UserStorageInterface } from "@/models/storage/user";
import { TouchIdStorageInterface } from "@/models/storage/touchID";

/**
 * Interface to hold all storage clients.
 */
export interface StorageClientInterface {
  user: UserStorageInterface;
  touchId: TouchIdStorageInterface;
}
