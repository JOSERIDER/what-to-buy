import { StoreModuleName, UserStateInterface } from "@/models/store";
import { dispatchModuleAction, rootStore } from "@/store";

const userStore = {
  get state(): UserStateInterface {
    return rootStore.state.userProfileState;
  },
  async action<T>(actionName: string, params?: T) {
    await dispatchModuleAction(
      StoreModuleName.userProfileState,
      actionName,
      params
    );
  },
};

export const useUserStore = () => userStore;
