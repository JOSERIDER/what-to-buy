import { User } from "@/models/Users";

export interface UserRepositoryInterface {
  getUser(id: string): Promise<User>;

  create(payload: User);

  update(id: string, payload: User);

  delete(id: string);
}
