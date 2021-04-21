import { ListsStateInterface, StoreModuleName } from "@/models/store";
import { dispatchModuleAction, rootStore } from "@/store";

const listsStore = {
  get state(): ListsStateInterface {
    return rootStore.state.listsState;
  },
  async action<T>(actionName: string, params?: T) {
    await dispatchModuleAction(StoreModuleName.listsState, actionName, params);
  },
};

export const useListsStore = () => listsStore;
