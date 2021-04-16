import { SharedListRepositoryInterface } from "@/repository/SharedList/SharedListRepositoryInterface";
import { SharedList } from "@/models/SharedList";
import Client from "@/repository/Client/firebaseClient.js";

export class SharedListRepository implements SharedListRepositoryInterface {
  private resource = "sharedList";

  async getList(id: string): Promise<SharedList> {
    return (
      await Client(this.resource)
        .doc(id)
        .get()
    ).data() as SharedList;
  }

  async getUserList(userId: string): Promise<SharedList[]> {
    //TODO: DO this request reactive
    const resp = await Client(this.resource)
      .where("users", "array-contains", userId)
      .get();
    return resp.docs.map(doc => doc.data());
  }

  async create(payload: SharedList) {
    await Client(this.resource)
      .doc(payload.listCode)
      .set(payload);
  }

  async delete(id: string) {
    await Client(this.resource)
      .doc(id)
      .delete();
  }

  async update(id: string, payload: SharedList) {
    await Client(this.resource)
      .doc(id)
      .update(payload);
  }

  async checkList(id: string): Promise<boolean> {
    const resp = await Client(this.resource)
      .doc(id)
      .get();
    return resp.exists;
  }

  async addUser(listId: string, userId: string): Promise<boolean> {
    const list: SharedList = (
      await Client(this.resource)
        .doc(listId)
        .get()
    ).data();
    //This means that user already belong to this list.
    if (list.users.includes(userId)) {
      return false;
    }
    list.users.push(userId);
    await this.update(listId, list);
    return true;
  }
}
