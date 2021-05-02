import {
  ProductsSelectionStateInterface,
  StoreModuleName,
} from "@/models/store";
import { dispatchModuleAction, rootStore } from "@/store";

const productsSelectionStore = {
  get state(): ProductsSelectionStateInterface {
    return rootStore.state.productsSelectionState;
  },
  async action<T>(actionName: string, params?: T) {
    await dispatchModuleAction(
      StoreModuleName.productsSelectionState,
      actionName,
      params
    );
  },
};

export const useProductsSelectionStore = () => productsSelectionStore;
