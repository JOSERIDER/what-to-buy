import { List } from "@/models/List";

export interface PrivateListsApiClientModelInterface {
  getList(id: string): Promise<List>;

  getUserList(userId: string): Promise<List[]>;

  create(payload: List): Promise<void>;

  update(id: string, payload: List): Promise<void>;

  delete(id: string): Promise<void>;
}
