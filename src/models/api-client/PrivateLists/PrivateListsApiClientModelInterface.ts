/**
 * @name PrivateListsApiClientModelInterface
 * @description Interface for privateList client.
 */
import { List } from "@/models/domain/list";

export interface PrivateListsApiClientModelInterface {
  /**
   * Obtain the specific list by list id.
   * @param id = Id of list
   * @return Return the list that corresponding to given id.
   */
  get(id: string): Promise<List>;

  /**
   * Obtains all lists that user belong.
   * @param userId - id of user to obtain the lists.
   * @return Return an array of lists.
   */
  getUserList(userId: string): Promise<List[]>;

  /**
   * Create a list on database.
   * @param payload = list to create.
   */
  create(payload: List): Promise<void>;

  /**
   * Update a list on database.
   * @param id - list id to update.
   * @param payload - List object to upload to database.
   */
  update(id: string, payload: List): Promise<void>;

  /**
   * Delete a list on database by given id.
   * @param id - Id of list to be deleted.
   */
  delete(id: string): Promise<void>;
}
