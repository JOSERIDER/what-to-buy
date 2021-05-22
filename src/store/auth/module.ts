import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { ActionType, MutationType, RootStateInterface } from "@/models/store";

import { AuthStateInterface } from "@/models/store/autn";
import { initialState } from "@/store/auth/InitialState";
import apiClient, { firebaseAuth } from "@/api-client";
import firebase from "firebase";
import { useUserStore } from "@/store/user";
import { User, UserBuild } from "@/models/domain/user";
import { SharedList, SharedListBuild } from "@/models/domain/sharedList";
import { useListsStore } from "@/store/lists";

function buildUser(
  listCode: string,
  userId: string,
  name: string,
  email: string
): User {
  return UserBuild.build(userId, email, name, listCode);
}

function buildSharedList(
  listName: string,
  userName: string,
  userId: string
): SharedList {
  if (!listName) {
    listName = `${userName} list`;
  }
  return SharedListBuild.build(userId, listName);
}

export const mutations: MutationTree<AuthStateInterface> = {
  loading(state: AuthStateInterface) {
    state.loading = true;
  },
  loaded(state: AuthStateInterface) {
    state.loading = false;
  },
  setUser(state: AuthStateInterface, user: any) {
    state.user = user;
  },
  removeUser(state: AuthStateInterface) {
    state.user = null;
  },
  setError(state: AuthStateInterface, error: string) {
    state.error = error;
  },
};

export const actions: ActionTree<AuthStateInterface, RootStateInterface> = {
  async login({ commit, state }, { email, password }) {
    commit(MutationType.auth.loading);
    commit(MutationType.auth.setError, "");
    const userApiClient = apiClient.users;
    const userStore = useUserStore();

    try {
      await firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const user = await firebaseAuth.signInWithEmailAndPassword(
        email,
        password
      );

      commit(MutationType.auth.setUser, user);

      const userDB = await userApiClient.get(state.user.user?.uid as string);

      await userStore.action(ActionType.user.setUser, userDB);
      commit(MutationType.auth.loaded);
    } catch (error) {
      commit(MutationType.auth.loaded);
      commit(MutationType.auth.setError, error.message);
    }
  },

  async signUp({ commit }, { email, password, userName, listName }) {
    commit(MutationType.auth.loading);
    const listsStore = useListsStore();
    const userStore = useUserStore();

    try {
      await firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      const user = await firebaseAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      commit(MutationType.auth.setUser, user);

      const sharedList = buildSharedList(
        listName,
        userName,
        user.user?.uid as string
      );

      const newUser = buildUser(
        sharedList.listCode,
        user.user?.uid as string,
        userName,
        email
      );

      await listsStore.action(
        ActionType.lists.createUserSharedList,
        sharedList
      );

      await userStore.action(ActionType.user.createUser, newUser);

      commit(MutationType.auth.loaded);
    } catch (error) {
      commit(MutationType.auth.loaded);
      commit(MutationType.auth.setError, error.message);
    }
  },

  async logout({ commit }) {
    commit(MutationType.auth.loading);
    await firebaseAuth.signOut();
    commit(MutationType.auth.removeUser);
    commit(MutationType.auth.loaded);
  },

  setUser({ commit }, user: any) {
    commit(MutationType.auth.setUser, user);
  },

  userLoaded({ commit }) {
    commit(MutationType.auth.loaded);
  },

  resetError({ commit }) {
    commit(MutationType.auth.setError, "");
  },
};

export const getters: GetterTree<AuthStateInterface, RootStateInterface> = {
  //TODO
};

const namespaced = true;
const state: AuthStateInterface = initialState;
export const authState: Module<AuthStateInterface, RootStateInterface> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
