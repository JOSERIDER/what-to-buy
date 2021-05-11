import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import {
  ActionType,
  MutationType,
  ProductFilterInterface,
  ProductsStateInterface,
  RootStateInterface,
} from "@/models/store";
import { initialState } from "@/store/products/initialState";
import { Product } from "@/models/domain/product";
import apiClient from "@/api-client";

export const mutations: MutationTree<ProductsStateInterface> = {
  setProducts(state: ProductsStateInterface, products: Product[]) {
    state.products = products;
  },

  setLoading(state: ProductsStateInterface, isLoading: boolean) {
    state.loading = isLoading;
  },

  setError(state: ProductsStateInterface, error: string) {
    state.error = error;
  },

  setFilterState(
    state: ProductsStateInterface,
    filter: ProductFilterInterface
  ) {
    state.filter = filter;
    state.filter.name = state.name;
  },

  setName(state: ProductsStateInterface, name: string) {
    state.name = name;
  },
};

export const actions: ActionTree<ProductsStateInterface, RootStateInterface> = {
  async fetchProducts({ commit }) {
    try {
      commit(MutationType.products.setLoading, true);
      const productsApiClient = apiClient.products;

      const products = await productsApiClient.getProducts();

      commit(MutationType.products.setProducts, products);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  async addProduct({ commit, dispatch }, product: Product) {
    try {
      commit(MutationType.products.setLoading, true);
      const productsApiClient = apiClient.products;

      await productsApiClient.create(product);

      await dispatch(ActionType.products.fetchProducts);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  async fetchProductsById({ commit }, productsId: string[]) {
    try {
      commit(MutationType.products.setLoading, true);
      const productsApiClient = apiClient.products;

      if (!productsId) return;

      const products = await productsApiClient.getProductsById(productsId);

      commit(MutationType.products.setProducts, products);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  async getProductsByName({ commit }, name: string) {
    try {
      commit(MutationType.products.setLoading, true);
      commit(MutationType.products.setName, name);
      const productsApiClient = apiClient.products;

      const products = await productsApiClient.getProductsByName(name);

      commit(MutationType.products.setProducts, products);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  setFilter({ commit }, filter: ProductFilterInterface) {
    commit(MutationType.products.setFilterState, filter);
  },

  async fetchFilterProducts({ commit, state }) {
    try {
      commit(MutationType.products.setLoading, true);
      const productsApiClient = apiClient.products;

      const products = await productsApiClient.getFilterProducts(state.filter);

      commit(MutationType.products.setProducts, products);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },
};

export const getters: GetterTree<
  ProductsStateInterface,
  RootStateInterface
> = {};

const namespaced = true;
const state: ProductsStateInterface = initialState;
export const productsState: Module<
  ProductsStateInterface,
  RootStateInterface
> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
