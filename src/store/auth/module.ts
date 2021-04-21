import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { MutationType, RootStateInterface } from "@/models/store";

import { AuthStateInterface } from "@/models/store/autn";
import { initialState } from "@/store/auth/InitialState";
import { firebaseAuth } from "@/api-client";
import firebase from "firebase";

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
};

export const actions: ActionTree<AuthStateInterface, RootStateInterface> = {
  async login({ commit }, { email, password }) {
    commit(MutationType.auth.loading);
    await firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    const user = await firebaseAuth.signInWithEmailAndPassword(email, password);
    commit(MutationType.auth.setUser, user);
    commit(MutationType.auth.loaded);
  },
  async signUp({ commit }, { email, password }) {
    commit(MutationType.auth.loading);
    await firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    const user = await firebaseAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    commit(MutationType.auth.setUser, user);
    commit(MutationType.auth.loaded);
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
