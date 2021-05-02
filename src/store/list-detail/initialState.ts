import { ListDetailStateInterface } from "@/models/store/list-detail";
import { List } from "@/models/domain/list";

/**
 * Initialize list detail store with default values.
 * @name initialState
 */
export const initialState: ListDetailStateInterface = {
  products: [],
  loading: false,
  summary: 0,
  error: "",
  list: {} as List,
  type: "",
};
