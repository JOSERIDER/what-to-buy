import { UserStateInterface } from "@/models/store";

/**
 * @name initialState
 * @description Instance of user state with default values.
 */
export const initialState: UserStateInterface = {
  user: {},
  isLoading: false,
};
