import { AuthStateInterface } from "@/models/store/autn";

/**
 * @name initialState
 * @description Instance of auth state with default values.
 */
export const initialState: AuthStateInterface = {
  loading: false,
  user: null,
};
