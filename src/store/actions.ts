import { ActionTypes } from "@/store/action-types";
import { Mutations } from "@/store/mutations";
import { ActionContext, ActionTree } from "vuex";
import { State } from "@/store/state";
import { User } from "@/models/Usuario";
import { storage } from "@/storage";
import { MutationsTypes } from "@/store/mutations-types";

const CURRENT_USER_STORAGE = "CURRENT_USER_STORAGE";
const USER_UID_STORAGE = "USER_UID_STORAGE";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface Actions {
  [ActionTypes.GET_USER]({ commit }: AugmentedActionContext): Promise<User>;

  [ActionTypes.SET_USER](
    { commit }: AugmentedActionContext,
    payload: User
  ): boolean;

  [ActionTypes.REMOVE_USER]({ commit }: AugmentedActionContext): boolean;
}

export const actions: ActionTree<State, State> = {
  async [ActionTypes.GET_USER]({ commit }) {
    const r = await storage.create();
    const user = await r.get(CURRENT_USER_STORAGE);
    commit(MutationsTypes.SET_USER, user);

    return user;
  },

  async [ActionTypes.SET_USER]({ commit }, payload: User) {
    const r = await storage.create();
    await r.set(USER_UID_STORAGE, payload.id);
    await r.set(CURRENT_USER_STORAGE, payload);
    commit(MutationsTypes.SET_USER, payload);

    return true;
  },

  async [ActionTypes.REMOVE_USER]({ commit }) {
    const r = await storage.create();
    await r.remove(USER_UID_STORAGE);
    await r.remove(CURRENT_USER_STORAGE);
    commit(MutationsTypes.REMOVE_USER);

    return true;
  },
};
