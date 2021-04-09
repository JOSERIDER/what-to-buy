import { UserRepositoryInterface } from "@/repository/User/UserRepositoryInterface";
import { User } from "@/models/Users";
import Client from "../Client/firebaseClient.js";

export class UserRepository implements UserRepositoryInterface {
  private resource = "usuarios";

  async create(payload: User) {
    await Client(this.resource)
      .doc(payload.id)
      .set(payload);
  }

  async delete(id: string) {
    await Client(this.resource)
      .doc(id)
      .delete();
  }

  async getUser(id: string): Promise<User> {
    return (await Client(this.resource)
      .doc(id)
      .get()
      .data()) as User;
  }

  async update(id: string, payload: User) {
    await Client(this.resource)
      .doc(id)
      .update(payload);
  }
}
