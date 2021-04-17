import { SharedList } from "@/models/SharedList";

export interface SharedListsApiClientModelInterface {
  get(id: string): Promise<SharedList>;

  getUserList(userId: string): Promise<SharedList[]>;

  create(payload: SharedList): Promise<void>;

  update(id: string, payload: SharedList): Promise<void>;

  delete(id: string): Promise<void>;

  checkList(id: string): Promise<boolean>;

  addUser(listId: string, userId: string): Promise<boolean>;
}
