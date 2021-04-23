import { StoreModuleName } from "@/models/store";
import { dispatchModuleAction, rootStore } from "@/store";
import { AuthStateInterface } from "@/models/store/autn";

const authStore = {
  get state(): AuthStateInterface {
    return rootStore.state.authState;
  },
  async action<T>(actionName: string, params?: T) {
    await dispatchModuleAction(StoreModuleName.authState, actionName, params);
  },
};

export const useAuthsStore = () => authStore;
