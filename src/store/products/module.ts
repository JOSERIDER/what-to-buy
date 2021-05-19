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
import { storage } from "@/models/http-client/client/firebase.config";
import useKeyWordGen from "@/use/useKeyWordGen";
import useCategory from "@/use/useCategory";

export const mutations: MutationTree<ProductsStateInterface> = {
  setProducts(state: ProductsStateInterface, products: Product[]) {
    if (state.products) {
      state.products = state.products.concat(products);
      return;
    }

    state.products = products;
  },

  setInfiniteScroll(state: ProductsStateInterface, enabled: boolean) {
    state.isDisableInfiniteScroll = enabled;
  },

  setLastQuery(state: ProductsStateInterface, lastQuery: any) {
    state.lastQuery = lastQuery;
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
    state.isFilter = true;
  },

  restoreFilter(state: ProductsStateInterface) {
    state.filter = {
      minPrice: 0,
      maxPrice: 100,
      name: "",
      category: useCategory().categories[0],
    };
    state.isFilter = false;
  },

  setName(state: ProductsStateInterface, name: string) {
    state.name = name;
  },

  restoreProducts(state: ProductsStateInterface) {
    state.products = [];
    state.lastQuery = null;
    state.isDisableInfiniteScroll = false;
  },

  restoreName(state: ProductsStateInterface) {
    state.name = "";
  },
};

export const actions: ActionTree<ProductsStateInterface, RootStateInterface> = {
  async fetchProducts({ commit }) {
    try {
      commit(MutationType.listDetail.setError, "");
      commit(MutationType.products.setLoading, true);
      commit(MutationType.products.restoreFilter);
      const productsApiClient = apiClient.products;

      const products = await productsApiClient.getProducts();

      if (products.length < 10) {
        commit(MutationType.products.setInfiniteScroll, true);
        commit(MutationType.products.setLastQuery, null);
      }

      commit(MutationType.products.setProducts, products);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  async addProduct({ commit, dispatch }, { base64Data, fileName, product }) {
    try {
      commit(MutationType.products.setLoading, true);
      const productsApiClient = apiClient.products;

      if (base64Data && fileName) {
        const response = await storage("gs://shopping-list-93c19.appspot.com")
          .ref(fileName)
          .putString(base64Data, "data_url");

        product.image = await response.ref.getDownloadURL();
      } else {
        product.image =
          "https://firebasestorage.googleapis.com/v0/b/shopping-list-93c19.appspot.com/o/images%2Fdefault-product.png?alt=media&token=822bdabf-84df-4006-a865-ea7b96294798";
      }

      product.keyWords = useKeyWordGen().generateKeywords([product.name]);

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
      commit(MutationType.products.restoreFilter);
      commit(MutationType.products.restoreProducts);

      const products = await productsApiClient.getProductsByName(name);

      if (products.length < 10) {
        commit(MutationType.products.setInfiniteScroll, true);
        commit(MutationType.products.setLastQuery, null);
      }

      commit(MutationType.products.setProducts, products);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  async loadData({ commit, state }) {
    try {
      commit(MutationType.products.setLoading, true);
      commit(MutationType.products.setError, "");

      const productsApiClient = apiClient.products;

      let products: Product[] = [];
      if (state.name === "" && !state.isFilter) {
        products = await productsApiClient.getProducts();
      } else if (state.isFilter) {
        products = await productsApiClient.getFilterProducts(state.filter);
      } else {
        products = await productsApiClient.getProductsByName(state.name);
      }

      if (products.length < 10) {
        commit(MutationType.products.setInfiniteScroll, true);
        commit(MutationType.products.setLastQuery, null);
      } else {
        commit(MutationType.products.setInfiniteScroll, false);
      }

      commit(MutationType.products.setProducts, products);
    } catch (error) {
      commit(MutationType.products.setError, error.message);
    } finally {
      commit(MutationType.products.setLoading, false);
    }
  },

  setFilter({ commit }, filter: ProductFilterInterface) {
    commit(MutationType.products.setFilterState, filter);
  },

  setLoading({ commit }, state: boolean) {
    commit(MutationType.products.setLoading, state);
  },

  async fetchFilterProducts({ commit, state }) {
    try {
      commit(MutationType.products.setLoading, true);
      const productsApiClient = apiClient.products;
      commit(MutationType.products.restoreProducts);

      const products = await productsApiClient.getFilterProducts(state.filter);

      commit(MutationType.products.setProducts, products);
    } catch (error) {
      console.error(error);
      commit(MutationType.products.setError, error.message);
    } finally {
      commit(MutationType.products.setLoading, false);
    }
  },

  setLastQuery({ commit }, lastQuery) {
    commit(MutationType.products.setLastQuery, lastQuery);
  },

  restoreProducts({ commit }) {
    commit(MutationType.products.restoreProducts);
  },

  restoreStore({ commit }) {
    commit(MutationType.products.restoreProducts);
    commit(MutationType.products.restoreName);
    commit(MutationType.products.restoreFilter);
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
