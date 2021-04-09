import { PrivateListRepositoryInterface } from "@/repository/PrivateList/PrivateListRepositoryInterface";
import { List } from "@/models/List";
import Client from "../Client/firebaseClient.js";

export class PrivateListRepository implements PrivateListRepositoryInterface {
  private resource = "privateList";

  async getList(id: string): Promise<List> {
    return (
      await Client(this.resource)
        .doc(id)
        .get()
    ).data() as List;
  }

  async create(payload: List) {
    await Client(this.resource)
      .doc(payload.listCode)
      .set(payload);
  }

  async update(id: string, payload: List) {
    await Client(this.resource)
      .doc(id)
      .update(payload);
  }

  async delete(id: string) {
    await Client(this.resource)
      .doc(id)
      .delete();
  }

  async getUserList(userId: string): Promise<List[]> {
    //TODO:
    const resp = await Client(this.resource)
      .where("admin", "==", userId)
      .get();
    return resp.docs.map(doc => doc.data());
  }
}
