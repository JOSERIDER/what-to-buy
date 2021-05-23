import { User } from "@/models/domain/user";

/**
 * Interface that represent the user store.
 */
export interface UserStateInterface {
  user: User;
  isLoading: boolean;
  error: string;
}
