import { State } from "@/store/state";
import { User } from "@/models/Usuario";
import { GetterTree } from "vuex";

export type Getters = {
  loggedUser(state: State): User;
};

export const getters: GetterTree<State, State> & Getters = {
  loggedUser(state: State): User {
    return state.user as User;
  },
};
