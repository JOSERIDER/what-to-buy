import { SharedList } from "@/models/SharedList";

/**
 * @name SharedListsApiClientModelInterface
 * @description Interface of sharedList api client.
 */
export interface SharedListsApiClientModelInterface {
  /**
   * Obtain a list by given id.
   * @param id - Id of list to be obtained.
   * @return return the list by given id.
   */
  get(id: string): Promise<SharedList>;

  /**
   * Obtain sharedList that user belong.
   * @param userId - Id of user to obtain the lists.
   * @return return an array of SharedList that user belong.
   */
  getUserList(userId: string): Promise<SharedList[]>;

  /**
   * Create an user on database.
   * @param payload - SharedList object to be created.
   */
  create(payload: SharedList): Promise<void>;

  /**
   * Update a user on database.
   * @param id - Id of SharedList to be updated.
   * @param payload - SharedList object.
   */
  update(id: string, payload: SharedList): Promise<void>;

  /**
   * Delete a SharedList by given id.
   * @param id = Id of SharedList to be deleted.
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a list by given id exists on database.
   * @param id - Id of list to be checked.
   * @return return true if the list exists or return false if the lists doesn't exists.
   */
  checkList(id: string): Promise<boolean>;

  /**
   * Insert a user in a SharedList.
   * @param listId - Id of list to be inserted.
   * @param userId - Id of user to be inserted.
   * @return return true if process is successfully or false instead.
   */
  addUser(listId: string, userId: string): Promise<boolean>;
}
