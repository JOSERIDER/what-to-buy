import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import {
  ActionType,
  ListsStateInterface,
  MutationType,
  RootStateInterface,
} from "@/models/store";
import { initialState } from "@/store/lists/InitialState";
import privateListsApiClient from "@/api-client/PrivateLists";
import { useUserStore } from "@/store/user";
import sharedListsApiClient from "@/api-client/SharedLists";
import { List } from "@/models/domain/list";
import { SharedList } from "@/models/domain/sharedList";

export const mutations: MutationTree<ListsStateInterface> = {
  updateLists(state: ListsStateInterface, lists: List[]) {
    state.lists = lists;
  },
  loadingLists(state: ListsStateInterface) {
    state.loading = true;
  },
  loadedLists(state: ListsStateInterface) {
    state.loading = false;
  },
  changeType(state: ListsStateInterface, type: string) {
    state.type = type;
  },
  editLists(state: ListsStateInterface) {
    if (state.lists.length === 0) {
      state.editing = false;
    } else {
      state.editing = !state.editing;
    }
  },
  setError(state: ListsStateInterface, error: string) {
    state.error = error;
  },
  resetLists(state: ListsStateInterface) {
    state.lists = [];
    state.type = "Private";
    state.editing = false;
    state.error = "";
  },
};

export const actions: ActionTree<ListsStateInterface, RootStateInterface> = {
  async fetchLists({ commit, state }) {
    commit(MutationType.lists.loadingLists);
    const user = useUserStore().state.user;

    try {
      let lists;
      if (state.type === "Private") {
        lists = await privateListsApiClient.getUserList(user.id as string);
      } else {
        lists = await sharedListsApiClient.getUserList(user.id as string);
      }

      commit(MutationType.lists.updateLists, lists);
    } catch (error) {
      commit(ActionType.lists.setError, error.message);
    } finally {
      commit(MutationType.lists.loadedLists);
    }
  },

  async createList({ commit, state }, list: List) {
    try {
      commit(MutationType.lists.loadingLists);

      if (state.type === "Private") {
        await privateListsApiClient.create(list);
      }
    } catch (error) {
      commit(ActionType.lists.setError, error.message);
    } finally {
      commit(MutationType.lists.loadedLists);
    }
  },

  async deleteList({ commit }, listId: string) {
    try {
      commit(MutationType.lists.loadingLists);
      await privateListsApiClient.delete(listId);
    } catch (error) {
      commit(ActionType.lists.setError, error.message);
    } finally {
      commit(MutationType.lists.loadedLists);
    }
  },

  async updateList({ commit }, { listId, listItem }) {
    try {
      commit(ActionType.lists.setError, "");
      commit(MutationType.lists.loadingLists);

      await privateListsApiClient.update(listId, listItem);
    } catch (error) {
      commit(ActionType.lists.setError, error.message);
    } finally {
      commit(MutationType.lists.loadedLists);
    }
  },

  changeType({ commit }, type: string) {
    commit(MutationType.lists.changeType, type);
  },

  editLists({ commit }) {
    commit(MutationType.lists.editLists);
  },

  async createUserSharedList({ commit }, sharedList: SharedList) {
    try {
      commit(MutationType.lists.loadingLists);
      await sharedListsApiClient.create(sharedList);
    } catch (error) {
      commit(ActionType.lists.setError, error.message);
    } finally {
      commit(MutationType.lists.loadedLists);
    }
  },

  resetError({ commit }) {
    commit(ActionType.lists.setError, "");
  },

  async unJoinList({ commit, state }, listId: string) {
    try {
      commit(MutationType.lists.loadingLists);
      const userId = useUserStore().state.user.id as string;
      const list = state.lists.find(
        list => list.listCode === listId
      ) as SharedList;

      list.users = list.users.filter(id => id !== userId);

      await sharedListsApiClient.update(listId, list);
    } catch (error) {
      commit(ActionType.lists.setError, error.message);
    } finally {
      commit(MutationType.lists.loadedLists);
    }
  },

  resetLists({ commit }) {
    commit(MutationType.lists.resetLists);
  },
};

export const getters: GetterTree<ListsStateInterface, RootStateInterface> = {
  getLists(state: ListsStateInterface) {
    return state.lists;
  },
};

const namespaced = true;
const state: ListsStateInterface = initialState;
export const listsState: Module<ListsStateInterface, RootStateInterface> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
