import { SharedList } from "@/models/SharedList";

export interface SharedListRepositoryInterface {
  getList(id: string): Promise<SharedList>;

  getUserList(userId: string): Promise<SharedList[]>;

  create(payload: SharedList);

  update(id: string, payload: SharedList);

  delete(id: string);
}
