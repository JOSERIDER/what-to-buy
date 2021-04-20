/**
 * Interface that represent the user store.
 */
import { User } from "@/models/Users";

export interface UserStateInterface {
  user: User;
  isLoading: boolean;
}
