import { ListsStateInterface } from "@/models/store";

/**
 * Initialize list store with default values.
 * @name initialState
 */
export const initialState: ListsStateInterface = {
  lists: [],
  loading: false,
  type: "Private",
  editing: false,
  error: "",
};
