import { State } from "@/store/state";
import { User } from "@/models/Usuario";
import { GetterTree } from "vuex";
import { useStore } from "@/store/store";
import { ActionTypes } from "@/store/action-types";

export type Getters = {
  loggedUser(state: State): User;
  isLoggedIn(): Promise<boolean>;
};

export const getters: GetterTree<State, State> & Getters = {
  loggedUser(state: State): User {
    return state.user as User;
  },
  async isLoggedIn(): Promise<boolean> {
    const store = useStore();
    const user = await store.dispatch(ActionTypes.GET_USER);
    return !!user;
  },
};
