import { State } from "@/store/state";
import { User } from "@/models/Users";
import { GetterTree } from "vuex";

export type Getters = {
  loggedUser(state: State): User | null;
  isLoggedIn(state: State): boolean;
};

export const getters: GetterTree<State, State> & Getters = {
  loggedUser(state: State): User | null {
    return state.user;
  },
  isLoggedIn(state: State): boolean {
    return !!state.user;
  },
};
