import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import {
  ActionType,
  MutationType,
  ProductsSelectionStateInterface,
  RootStateInterface,
} from "@/models/store";
import { useListDetailStore } from "@/store/list-detail";
import { initialState } from "@/store/products-selection/initialState";

export const mutations: MutationTree<ProductsSelectionStateInterface> = {
  setProducts(state: ProductsSelectionStateInterface, products: {}[]) {
    state.products = products;
  },
  setLoading(state: ProductsSelectionStateInterface, isLoading: boolean) {
    state.loading = isLoading;
  },
  setError(state: ProductsSelectionStateInterface, error: string) {
    state.error = error;
  },
  selectProduct(state: ProductsSelectionStateInterface, productId: string) {
    state.products.find(
      product => product.product?.id === productId
    )!!.selected = true;
  },
  unselectProduct(state: ProductsSelectionStateInterface, productId: string) {
    state.products.find(
      product => product.product?.id === productId
    )!!.selected = false;
  },
};

export const actions: ActionTree<
  ProductsSelectionStateInterface,
  RootStateInterface
> = {
  async fetchProducts({ commit }) {
    try {
      commit(MutationType.productsSelection.setLoading, true);

      const productsStore = useListDetailStore();
      const listDetailStore = useListDetailStore();

      await productsStore.action(ActionType.products.fetchProducts);
      const products = productsStore.state.products;

      //Mark as selected the products the products on the list.
      const productsMap = products.map(product => {
        const selectedProduct = listDetailStore.state.products.find(
          p => p.id === product.id
        );

        product.quantity = selectedProduct ? selectedProduct.quantity : 0;

        return { product, selected: !!selectedProduct };
      });

      commit(MutationType.productsSelection.setProducts, productsMap);
    } catch (error) {
      commit(MutationType.productsSelection.setError, error);
    } finally {
      commit(MutationType.productsSelection.setLoading, false);
    }
  },
  selectProduct({ commit }, productId: string) {
    commit(MutationType.productsSelection.selectProduct, productId);
  },
  unselectProduct({ commit }, productId: string) {
    commit(MutationType.productsSelection.unselectProduct, productId);
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
