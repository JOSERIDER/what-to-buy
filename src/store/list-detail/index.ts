import { ListDetailStateInterface, StoreModuleName } from "@/models/store";
import { dispatchModuleAction, rootStore } from "@/store";

const listDetailStore = {
  get state(): ListDetailStateInterface {
    return rootStore.state.listDetailState;
  },
  async action<T>(actionName: string, params?: T) {
    await dispatchModuleAction(
      StoreModuleName.listDetailState,
      actionName,
      params
    );
  },
};

export const useListDetailState = () => listDetailStore;
