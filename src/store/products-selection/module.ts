import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import {
  ActionType,
  MutationType,
  ProductFilterInterface,
  ProductsSelectionStateInterface,
  RootStateInterface,
} from "@/models/store";
import { useListDetailStore } from "@/store/list-detail";
import { initialState } from "@/store/products-selection/initialState";
import { Product } from "@/models/domain/product";
import { DataProduct } from "@/models/domain/list";
import apiClient from "@/api-client";
import useCategory from "@/use/useCategory";

export const mutations: MutationTree<ProductsSelectionStateInterface> = {
  setProducts(state: ProductsSelectionStateInterface, products: Product[]) {
    if (state.products) {
      state.products = state.products.concat(products);
      return;
    }

    state.products = products;
  },

  setDataProducts(
    state: ProductsSelectionStateInterface,
    dataProduct: DataProduct[]
  ) {
    state.productsSelected = dataProduct;
  },

  setLoading(state: ProductsSelectionStateInterface, isLoading: boolean) {
    state.loading = isLoading;
  },

  setError(state: ProductsSelectionStateInterface, error: string) {
    state.error = error;
  },

  selectProduct(state: ProductsSelectionStateInterface, product: Product) {
    state.productsSelected.push({ cant: 1, idProduct: product.id });
  },

  unselectProduct(state: ProductsSelectionStateInterface, product: Product) {
    const productIndex = state.productsSelected.findIndex(
      dataProduct => dataProduct.idProduct === product.id
    );

    state.productsSelected.splice(productIndex, 1);
  },

  incrementQuantity(state: ProductsSelectionStateInterface, product: Product) {
    (state.productsSelected.find(
      dataProduct => dataProduct.idProduct === product.id
    )!!.cant as number) += 1;
  },

  decrementQuantity(state: ProductsSelectionStateInterface, product: Product) {
    (state.productsSelected.find(
      dataProduct => dataProduct.idProduct === product.id
    )!!.cant as number) -= 1;
  },

  setInfiniteScroll(state: ProductsSelectionStateInterface, disable: boolean) {
    state.isDisableInfiniteScroll = disable;
  },

  setLastQuery(state: ProductsSelectionStateInterface, lastQuery: any) {
    state.lastQuery = lastQuery;
  },

  setFilterState(
    state: ProductsSelectionStateInterface,
    filter: ProductFilterInterface
  ) {
    state.filter = filter;
    state.filter.name = state.name;
    state.isFilter = true;
  },

  restoreProducts(state: ProductsSelectionStateInterface) {
    state.products = [];
    state.lastQuery = null;
    state.isDisableInfiniteScroll = false;
  },

  restoreName(state: ProductsSelectionStateInterface) {
    state.name = "";
  },

  restoreFilter(state: ProductsSelectionStateInterface) {
    state.filter = {
      minPrice: 0,
      maxPrice: 100,
      name: "",
      category: useCategory().categories[0],
    };
    state.isFilter = false;
  },
};

export const actions: ActionTree<
  ProductsSelectionStateInterface,
  RootStateInterface
> = {
  async fetchProducts({ commit, state }) {
    try {
      commit(MutationType.productsSelection.setError, "");
      commit(MutationType.productsSelection.setLoading, true);
      const listDetailStore = useListDetailStore();
      const productsSelectionApiClient = apiClient.productsSelection;

      const products = await productsSelectionApiClient.getProducts(
        state.lastQuery
      );

      if (products.length < 10) {
        commit(MutationType.productsSelection.setInfiniteScroll, true);
        commit(MutationType.productsSelection.setLastQuery, null);
      }

      const dataProduct = listDetailStore.state.list.products;

      commit(MutationType.productsSelection.setDataProducts, dataProduct);

      commit(MutationType.productsSelection.setProducts, products);
    } catch (error) {
      commit(MutationType.productsSelection.setError, error.message);
    } finally {
      commit(MutationType.productsSelection.setLoading, false);
    }
  },

  async searchProducts({ commit }, name: string) {
    try {
      commit(MutationType.productsSelection.setLoading, true);

      //const productsStore = useProductsStore();

      //await productsStore.action(ActionType.products.getProductsByName, name);
      //const products = productsStore.state.products;

      //commit(MutationType.productsSelection.setProducts, products);
    } catch (error) {
      commit(MutationType.productsSelection.setError, error.message);
    } finally {
      commit(MutationType.productsSelection.setLoading, false);
    }
  },

  selectProduct({ commit }, product: Product) {
    commit(MutationType.productsSelection.selectProduct, product);
  },

  incrementQuantity({ commit }, product: Product) {
    commit(MutationType.productsSelection.incrementQuantity, product);
  },

  decrementQuantity({ commit, state }, product: Product) {
    const cant = state.productsSelected.find(
      dataProduct => dataProduct.idProduct === product.id
    )!!.cant as number;

    if (cant <= 1) {
      commit(MutationType.productsSelection.unselectProduct, product);
      return;
    }
    commit(MutationType.productsSelection.decrementQuantity, product);
  },

  unselectProduct({ commit }, product: Product) {
    commit(MutationType.productsSelection.unselectProduct, product);
  },

  async saveSelection({ state }) {
    const listDetailStore = useListDetailStore();

    await listDetailStore.action(
      ActionType.listDetail.saveSelection,
      state.productsSelected
    );
  },

  async fetchFilterProducts({ commit, state }) {
    try {
      commit(MutationType.productsSelection.setLoading, true);
      commit(MutationType.productsSelection.restoreProducts);
      const productsApiClient = apiClient.productsSelection;

      const products = await productsApiClient.getFilterProducts(state.filter);

      commit(MutationType.productsSelection.setProducts, products);
    } catch (error) {
      console.error(error);
      commit(MutationType.productsSelection.setError, error.message);
    } finally {
      commit(MutationType.productsSelection.setLoading, false);
    }
  },

  restoreStore({ commit }) {
    commit(MutationType.productsSelection.restoreProducts);
    commit(MutationType.productsSelection.restoreName);
    commit(MutationType.productsSelection.restoreFilter);
  },

  setLastQuery({ commit }, lastQuery) {
    commit(ActionType.productsSelection.setLastQuery, lastQuery);
  },

  setFilter({ commit }, filter: ProductFilterInterface) {
    commit(MutationType.productsSelection.setFilterState, filter);
  },
};

export const getters: GetterTree<
  ProductsSelectionStateInterface,
  RootStateInterface
> = {};

const namespaced = true;
const state: ProductsSelectionStateInterface = initialState;
export const productsSelectionState: Module<
  ProductsSelectionStateInterface,
  RootStateInterface
> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
