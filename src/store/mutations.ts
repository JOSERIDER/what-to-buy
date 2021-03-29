import { State } from "@/store/state";
import { MutationsTypes } from "@/store/mutations-types";
import { User } from "@/models/Usuario";
import { MutationTree } from "vuex";

//The mutations in the enum is represent by a function of type Mutations.
export type Mutations<S = State> = {
  [MutationsTypes.SET_USER](state: S, payload: User);
  [MutationsTypes.REMOVE_USER](state: S);
};

//The mutations variable is responsible for storing all of implemented mutations,
export const mutations: MutationTree<State> & Mutations = {
  [MutationsTypes.SET_USER](state: State, payload: User) {
    state.user = payload;
  },
  [MutationsTypes.REMOVE_USER](state: State) {
    state.user = null;
  },
};
