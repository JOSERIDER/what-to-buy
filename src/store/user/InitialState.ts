import { UserStateInterface } from "@/models/store";

/**
 * @name initialState
 * @description Instance of user state with default values.
 */
export const initialState: UserStateInterface = {
  user: null!!,
  isLoading: false,
  error: "",
};
