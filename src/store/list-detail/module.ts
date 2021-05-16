import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { ActionType, MutationType, RootStateInterface } from "@/models/store";
import { ListDetailStateInterface } from "@/models/store/list-detail";
import { initialState } from "@/store/list-detail/initialState";
import apiClient from "@/api-client";
import { Product } from "@/models/domain/product";
import { DataProduct, List } from "@/models/domain/list";
import { SharedList } from "@/models/domain/sharedList";
import { useProductsStore } from "@/store/products";

export const mutations: MutationTree<ListDetailStateInterface> = {
  setProducts(state: ListDetailStateInterface, products: Product[]) {
    state.products = products;
  },

  setLoading(state: ListDetailStateInterface, isLoading: boolean) {
    state.loading = isLoading;
  },

  incrementQuantity(state: ListDetailStateInterface, product: Product) {
    (state.products.find(p => p.id === product.id) as Product).quantity!! += 1;
  },

  decrementQuantity(state: ListDetailStateInterface, product: Product) {
    (state.products.find(p => p.id === product.id) as Product).quantity =
      (product?.quantity || 0) - 1;
  },

  setSummary(state: ListDetailStateInterface, summary: number) {
    state.summary = summary;
  },

  setError(state: ListDetailStateInterface, error: string) {
    state.error = error;
  },

  setList(state: ListDetailStateInterface, list: List) {
    state.list = list;
  },

  deleteProduct(state: ListDetailStateInterface, productId: string) {
    const index = state.products.findIndex(p => p.id === productId);
    state.products.splice(index, 1);
  },

  updateList(state: ListDetailStateInterface) {
    const aux: any[] = [];
    state.products.forEach(product => {
      const dataProduct = { cant: product.quantity, idProduct: product.id };
      aux.push(dataProduct);
    });

    state.list.products = aux;
  },

  resetStore(state: ListDetailStateInterface) {
    state.list = {} as List;
    state.products = [];
    state.error = "";
    state.summary = 0;
    state.loading = false;
  },

  addProduct(state: ListDetailStateInterface, product: Product) {
    state.products.push(product);
  },

  setType(state: ListDetailStateInterface, type: string) {
    state.type = type;
  },

  updateListDataProduct(
    state: ListDetailStateInterface,
    dataProduct: DataProduct[]
  ) {
    state.list.products = dataProduct;
  },
};

export const actions: ActionTree<
  ListDetailStateInterface,
  RootStateInterface
> = {
  async fetchProducts({ commit, state, dispatch }) {
    try {
      commit(MutationType.listDetail.setError, "");
      commit(MutationType.listDetail.setLoading, true);
      const productsApiClient = apiClient.products;

      if (!state.list.products) return;

      const productsId: string[] = state.list.products.map(
        p => p.idProduct
      ) as string[];


      if (!productsId) return;

      const products = await productsApiClient.getProductsById(productsId);

      products.map(p => {
        p.quantity =
          state.list.products.find(
            dataProduct => dataProduct.idProduct === p.id
          )?.cant || 0;

        return p;
      });

      commit(MutationType.listDetail.setProducts, products);

      dispatch(ActionType.listDetail.updateSummary);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  async fetchList({ commit }, { listId, listType }) {
    try {
      commit(MutationType.listDetail.setLoading, true);

      let list: List;
      if (listType === "Private") {
        list = await apiClient.privateLists.get(listId);
      } else {
        list = await apiClient.sharedLists.get(listId);
      }

      commit(MutationType.listDetail.setList, list);
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  incrementQuantity({ commit }, product: Product) {
    commit(MutationType.listDetail.incrementQuantity, product);
  },

  decrementQuantity({ commit, dispatch }, product: Product) {
    if ((product.quantity || 0) <= 1) {
      dispatch(ActionType.listDetail.deleteProduct, product.id);
      return;
    }
    commit(MutationType.listDetail.decrementQuantity, product);
  },

  updateSummary({ commit, state }) {
    let summary = 0;
    state.products.forEach(product => {
      summary += (product?.price || 0) * (product?.quantity || 0);
    });

    summary = Math.round(summary * 100) / 100;

    commit(MutationType.listDetail.setSummary, summary);
  },

  deleteProduct({ commit }, productId: string) {
    commit(MutationType.listDetail.deleteProduct, productId);
  },

  async updateList({ commit, state }) {
    try {
      commit(MutationType.listDetail.setLoading, true);
      commit(MutationType.listDetail.updateList);
      if (state.type === "Private") {
        await apiClient.privateLists.update(state.list.listCode, state.list);
      } else {
        await apiClient.sharedLists.update(
          state.list.listCode,
          state.list as SharedList
        );
      }
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  resetStore({ commit }) {
    commit(MutationType.listDetail.resetStore);
  },

  addProduct({ commit, state, dispatch }, product: Product) {
    const productIndex = state.products.findIndex(p => p.id === product.id);

    if (productIndex !== -1) {
      commit(MutationType.listDetail.incrementQuantity, product);
      dispatch(ActionType.listDetail.updateSummary);
      return;
    }
    if (!product.quantity) {
      product.quantity = 1;
    }

    dispatch(ActionType.listDetail.updateSummary);
    commit(MutationType.listDetail.addProduct, product);
  },

  async saveSelection({ commit, state }, products: DataProduct[]) {
    commit(MutationType.listDetail.updateListDataProduct, products);
    try {
      commit(MutationType.listDetail.setLoading, true);
      if (state.type === "Private") {
        await apiClient.privateLists.update(state.list.listCode, state.list);
      } else {
        await apiClient.sharedLists.update(
          state.list.listCode,
          state.list as SharedList
        );
      }
    } catch (error) {
      commit(MutationType.listDetail.setError, error.message);
    } finally {
      commit(MutationType.listDetail.setLoading, false);
    }
  },

  setType({ commit }, type: string) {
    commit(MutationType.listDetail.setType, type);
  },
};

export const getters: GetterTree<
  ListDetailStateInterface,
  RootStateInterface
> = {
  //TODO
};

const namespaced = true;
const state: ListDetailStateInterface = initialState;
export const listDetailState: Module<
  ListDetailStateInterface,
  RootStateInterface
> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
