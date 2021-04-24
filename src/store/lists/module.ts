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
      commit(MutationType.lists.loadedLists);
    } catch (error) {
      commit(MutationType.lists.loadedLists);
      commit(
        ActionType.lists.setError,
        "Something went wrong, with our server or network connection."
      );
    }
  },

  async createList({ commit, state }, list: List) {
    try {
      commit(MutationType.lists.loadingLists);

      if (state.type === "Private") {
        await privateListsApiClient.create(list);
        commit(MutationType.lists.loadedLists);
        return;
      }
    } catch (error) {
      commit(MutationType.lists.loadedLists);
      commit(
        ActionType.lists.setError,
        "Something went wrong, with our server or network connection."
      );
    }
  },

  async deleteList({ commit }, listId: string) {
    try {
      commit(MutationType.lists.loadingLists);
      await privateListsApiClient.delete(listId);
    } catch (e) {
      commit(MutationType.lists.loadedLists);
      commit(
        ActionType.lists.setError,
        "Something went wrong, with our server or network connection."
      );
    }
    commit(MutationType.lists.loadedLists);
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
      commit(MutationType.lists.loadedLists);
    } catch (e) {
      commit(MutationType.lists.loadedLists);
      commit(
        ActionType.lists.setError,
        "Something went wrong, with our server or network connection."
      );
    }
  },

  resetError({ commit }) {
    commit(ActionType.lists.setError, "");
  },
};

export const getters: GetterTree<ListsStateInterface, RootStateInterface> = {
  getLists(state: ListsStateInterface) {
    return state.lists;
  },
};

const namespaced = true;
const state: ListsStateInterface = initialState;
export const listState: Module<ListsStateInterface, RootStateInterface> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
