import { User } from "@/models/Users";

/**
 * @name UsersApiClientModel
 * @description Interface for user api client.
 */
export interface UsersApiClientModelInterface {
  get(id: string): Promise<User>;

  create(payload: User): Promise<void>;

  update(id: string, payload: User): Promise<void>;

  delete(id: string): Promise<void>;
}
