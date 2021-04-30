import { createStore, StoreOptions } from "vuex";
import { RootStateInterface, RootStoreModel } from "@/models/store";
import { initialRootState } from "@/store/root/InitialState";
import { userState } from "@/store/user/module";
import { listState } from "@/store/lists/module";
import { authState } from "@/store/auth/module";
import { listDetailState } from "@/store/list-detail/module";
import { productsState } from "@/store/products/module";

/**
 * Vuex options to create a modularize store.
 */
const storeOptions: StoreOptions<RootStateInterface> = {
  state: initialRootState,
  modules: {
    userState: userState,
    listsState: listState,
    authState: authState,
    listDetailState: listDetailState,
    productsState: productsState,
  },
};

/**
 * Root instance of Vuex store.
 */
export const rootStore: RootStoreModel<RootStateInterface> = createStore(
  storeOptions
) as any;

export async function dispatchModuleAction<T>(
  moduleName: string,
  actionName: string,
  params?: T
) {
  await rootStore.dispatch(`${moduleName}/${actionName}`, params);
}
