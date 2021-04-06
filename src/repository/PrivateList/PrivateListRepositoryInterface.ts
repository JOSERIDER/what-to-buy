import { List } from "@/models/List";

export interface PrivateListRepositoryInterface {
  getList(id: string): Promise<List>;

  getUserList(userId: string): Promise<List[]>;

  create(payload: List);

  update(id: string, payload: List);

  delete(id: string);
}
