import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { ActionType, MutationType, RootStateInterface } from "@/models/store";
import { ListDetailStateInterface } from "@/models/store/list-detail";
import { initialState } from "@/store/list-detail/initialState";
import apiClient from "@/api-client";
import { Product } from "@/models/domain/product";
import { List } from "@/models/domain/list";
import { SharedList } from "@/models/domain/sharedList";

export const mutations: MutationTree<ListDetailStateInterface> = {
  setProducts(state: ListDetailStateInterface, products: Product[]) {
    state.products = products;
  },

  setLoading(state: ListDetailStateInterface, isLoading: boolean) {
    state.loading = isLoading;
  },

  incrementQuantity(state: ListDetailStateInterface, product: Product) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
};

export const actions: ActionTree<
  ListDetailStateInterface,
  RootStateInterface
> = {
  async fetchProducts({ commit, state, dispatch }) {
    try {
      commit(MutationType.ListDetail.setLoading, true);
      const productsApiClient = apiClient.products;

      if (!state.list.products) return;

      const productsId: string[] = state.list.products.map(
        p => p.idProduct
      ) as string[];

      const products = await productsApiClient.getProductsById(productsId);

      products.map(p => {
        p.quantity =
          state.list.products.find(
            dataProduct => dataProduct.idProduct === p.id
          )?.cant || 0;

        return p;
      });

      commit(MutationType.ListDetail.setProducts, products);

      dispatch(ActionType.listDetail.updateSummary);
    } catch (error) {
      commit(MutationType.ListDetail.setError, error.message);
    } finally {
      commit(MutationType.ListDetail.setLoading, false);
    }
  },

  async fetchList({ commit }, { listId, listType }) {
    try {
      commit(MutationType.ListDetail.setLoading, true);

      let list: List;
      if (listType === "Private") {
        list = await apiClient.privateLists.get(listId);
      } else {
        list = await apiClient.sharedLists.get(listId);
      }

      commit(MutationType.ListDetail.setList, list);
    } catch (error) {
      commit(MutationType.ListDetail.setError, error.message);
    } finally {
      commit(MutationType.ListDetail.setLoading, false);
    }
  },

  incrementQuantity({ commit }, product: Product) {
    commit(MutationType.ListDetail.incrementQuantity, product);
  },

  decrementQuantity({ commit, dispatch }, product: Product) {
    if ((product.quantity || 0) < 1) {
      dispatch(ActionType.listDetail.deleteProduct, product.id);
    }
    commit(MutationType.ListDetail.decrementQuantity, product);
  },

  updateSummary({ commit, state }) {
    let summary = 0;
    state.products.forEach(product => {
      summary += (product?.price || 0) * (product?.quantity || 0);
    });

    summary = Math.round(summary * 100) / 100;

    commit(MutationType.ListDetail.setSummary, summary);
  },

  deleteProduct({ commit }, productId: string) {
    commit(MutationType.ListDetail.deleteProduct, productId);
  },

  async updateList({ commit, state }, type: string) {
    try {
      commit(MutationType.ListDetail.setLoading, true);
      commit(MutationType.ListDetail.updateList);
      if (type === "Private") {
        await apiClient.privateLists.update(state.list.listCode, state.list);
      } else {
        await apiClient.sharedLists.update(
          state.list.listCode,
          state.list as SharedList
        );
      }
    } catch (error) {
      commit(MutationType.ListDetail.setError, error.message);
    } finally {
      commit(MutationType.ListDetail.setLoading, false);
    }
  },

  resetStore({ commit }) {
    commit(MutationType.ListDetail.resetStore);
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
