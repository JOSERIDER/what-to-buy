import { Module, MutationTree, ActionTree, GetterTree } from "vuex";
import {
  ActionType,
  MutationType,
  RootStateInterface,
  UserStateInterface,
} from "@/models/store";
import { initialState } from "@/store/user/InitialState";
import storageClient from "@/storage-client";
import usersApiClient from "@/api-client/users";
import { User } from "@/models/domain/user";
import apiClient, { firebaseAuth } from "@/api-client";
import { storage } from "@/models/http-client/client/firebase.config";

export const mutations: MutationTree<UserStateInterface> = {
  loadingUser(state: UserStateInterface) {
    state.isLoading = true;
  },
  loadedUser(state: UserStateInterface) {
    state.isLoading = false;
  },
  setUser(state: UserStateInterface, user: User) {
    state.user = user;
  },
  removeUser(state: UserStateInterface) {
    state.user = {};
  },
  setError(state: UserStateInterface, error: string) {
    state.error = error;
  },
};

export const actions: ActionTree<UserStateInterface, RootStateInterface> = {
  async setUser({ commit }, user: User) {
    commit(MutationType.user.loadingUser);
    const userStorage = storageClient.user;
    await userStorage.set(user);

    commit(MutationType.user.setUser, user);
    commit(MutationType.user.loadedUser);
  },

  async getUser({ commit }) {
    commit(MutationType.user.loadingUser);
    const userStorage = storageClient.user;
    const user: User = await userStorage.get();

    commit(MutationType.user.setUser, user);
    commit(MutationType.user.loadedUser);
  },

  async removeUser({ commit }) {
    commit(MutationType.user.loadingUser);
    const userStorage = storageClient.user;
    await userStorage.remove();

    commit(MutationType.user.removeUser);
    commit(MutationType.user.loadedUser);
  },

  async createUser({ commit, dispatch }, user: User) {
    commit(MutationType.user.loadingUser);
    await usersApiClient.create(user);
    dispatch(ActionType.user.setUser, user);
    commit(MutationType.user.loadedUser);
  },

  async updateUser(
    { commit, dispatch, state },
    { id, name, email }
  ): Promise<any> {
    try {
      commit(MutationType.user.setError, "");
      commit(MutationType.user.loadingUser);
      const userApiClient = apiClient.users;
      let user: User = { ...state.user };
      user.name = name;
      if (email !== user.email) {
        await firebaseAuth.currentUser!!.updateEmail(email);
        user.email = email;
      }

      user = JSON.parse(JSON.stringify(user));

      await userApiClient.update(id, user);
      await dispatch(ActionType.user.setUser, user);
    } catch (error) {
      commit(MutationType.user.setError, error.message);
      if (error.code === "auth/requires-recent-login") {
        return Promise.reject("require-login");
      } else if (error.code === "auth/email-already-in-use") {
        return Promise.reject("");
      }
    } finally {
      commit(MutationType.user.loadedUser);
    }
  },

  async updateUserProfileImage(
    { commit, dispatch, state },
    { base64Data, fileName, userId }
  ) {
    try {
      commit(MutationType.user.setError, "");
      commit(MutationType.user.loadingUser);
      const userApiClient = apiClient.users;
      let user: User = { ...state.user };

      if (base64Data && fileName) {
        const response = await storage("gs://shopping-list-93c19.appspot.com")
          .ref(fileName)
          .putString(base64Data, "data_url");

        user.image = await response.ref.getDownloadURL();
      }

      user = JSON.parse(JSON.stringify(user));

      await userApiClient.update(userId, user);
      await dispatch(ActionType.user.setUser, user);
    } catch (error) {
      commit(MutationType.user.setError, error.message);
      if (error.code === "auth/requires-recent-login") {
        return Promise.reject("require-login");
      } else if (error.code === "auth/email-already-in-use") {
        return Promise.reject("");
      }
    } finally {
      commit(MutationType.user.loadedUser);
    }
  },
};

export const getters: GetterTree<UserStateInterface, RootStateInterface> = {
  //TODO: NOT IMPLEMENTED YET
};

const namespaced = true;
const state: UserStateInterface = initialState;
export const userState: Module<UserStateInterface, RootStateInterface> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
