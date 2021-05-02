import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import {
  ActionType,
  MutationType,
  ProductSelectionType,
  ProductsSelectionStateInterface,
  RootStateInterface,
} from "@/models/store";
import { useListDetailStore } from "@/store/list-detail";
import { initialState } from "@/store/products-selection/initialState";
import { useProductsStore } from "@/store/products";
import { Product } from "@/models/domain/product";

export const mutations: MutationTree<ProductsSelectionStateInterface> = {
  setProducts(
    state: ProductsSelectionStateInterface,
    products: ProductSelectionType[]
  ) {
    state.products = products;
  },

  setLoading(state: ProductsSelectionStateInterface, isLoading: boolean) {
    state.loading = isLoading;
  },

  setError(state: ProductsSelectionStateInterface, error: string) {
    state.error = error;
  },

  selectProduct(
    state: ProductsSelectionStateInterface,
    product: ProductSelectionType
  ) {
    state.products.find(
      p => p.product?.id === product.product?.id
    )!!.selected = !product.selected;
  },

  unselectProduct(state: ProductsSelectionStateInterface, productId: string) {
    state.products.find(
      product => product.product?.id === productId
    )!!.selected = false;
  },

  incrementQuantity(state: ProductsSelectionStateInterface, product: Product) {
    (state.products.find(
      p => p.product?.id === product.id
    ) as any).product.quantity += 1;
  },

  decrementQuantity(state: ProductsSelectionStateInterface, product: Product) {
    (state.products.find(
      p => p.product?.id === product.id
    ) as any).product.quantity -= 1;
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
      //Mark as selected the products the products on the list.
      const productsMap = products.map(product => {
        const selectedProduct = listDetailStore.state.products.find(
          p => p.id === product.id
        );

        product.quantity = selectedProduct ? selectedProduct.quantity : 1;

        return { product, selected: !!selectedProduct };
      });

      commit(MutationType.productsSelection.setProducts, productsMap);
    } catch (error) {
      commit(MutationType.productsSelection.setError, error);
    } finally {
      commit(MutationType.productsSelection.setLoading, false);
    }
  },

  selectProduct({ commit }, product: ProductSelectionType) {
    commit(MutationType.productsSelection.selectProduct, product);
  },

  incrementQuantity({ commit }, product: Product) {
    commit(MutationType.productsSelection.incrementQuantity, product);
  },

  decrementQuantity({ commit }, product: Product) {
    commit(MutationType.productsSelection.decrementQuantity, product);
  },

  async saveSelection({ state }) {
    const listDetailStore = useListDetailStore();
    const products: Product[] = [];
    state.products.forEach(product => {
      if (product.selected) {
        products.push(product.product!!);
      }
    });

    await listDetailStore.action(ActionType.listDetail.saveSelection, products);
    await listDetailStore.action(ActionType.listDetail.updateList);
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
