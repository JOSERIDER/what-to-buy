import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import {
  ActionType,
  MutationType,
  ProductsSelectionStateInterface,
  RootStateInterface,
} from "@/models/store";
import { useListDetailStore } from "@/store/list-detail";
import { initialState } from "@/store/products-selection/initialState";
import { useProductsStore } from "@/store/products";
import { Product } from "@/models/domain/product";
import { DataProduct } from "@/models/domain/list";

export const mutations: MutationTree<ProductsSelectionStateInterface> = {
  setProducts(state: ProductsSelectionStateInterface, products: Product[]) {
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
};

export const actions: ActionTree<
  ProductsSelectionStateInterface,
  RootStateInterface
> = {
  async fetchProducts({ commit }) {
    try {
      commit(MutationType.productsSelection.setLoading, true);

      const productsStore = useProductsStore();
      const listDetailStore = useListDetailStore();

      await productsStore.action(ActionType.products.fetchProducts);
      const products = productsStore.state.products;

      const dataProduct = listDetailStore.state.list.products;

      commit(MutationType.productsSelection.setDataProducts, dataProduct);

      commit(MutationType.productsSelection.setProducts, products);
    } catch (error) {
      commit(MutationType.productsSelection.setError, error);
    } finally {
      commit(MutationType.productsSelection.setLoading, false);
    }
  },

  async searchProducts({ commit }, name: string) {
    try {
      commit(MutationType.productsSelection.setLoading, true);

      const productsStore = useProductsStore();

      await productsStore.action(ActionType.products.getProductsByName, name);
      const products = productsStore.state.products;

      commit(MutationType.productsSelection.setProducts, products);
    } catch (error) {
      commit(MutationType.productsSelection.setError, error);
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
