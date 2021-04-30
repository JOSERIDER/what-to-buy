import { ProductsStateInterface, StoreModuleName } from "@/models/store";
import { dispatchModuleAction, rootStore } from "@/store";

const productsStore = {
  get state(): ProductsStateInterface {
    return rootStore.state.productsState;
  },
  async action<T>(actionName: string, params?: T) {
    await dispatchModuleAction(
      StoreModuleName.productsState,
      actionName,
      params
    );
  },
};

export const useProductStore = () => productsStore;
