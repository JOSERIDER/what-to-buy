import { List } from "@/models/List";

/**
 * Interface that represent the lists store.
 */
export interface ListsStateInterface {
  /**
   * Array of lists.
   */
  lists: List[];

  /**
   * Indicate if lists are loaded.
   */
  loading: boolean;

  /**
   * Type of lists to fetch: Private or Shared,
   */
  type: string;

  /**
   * Indicate if lists are editing.
   */
  editing: boolean;
}
