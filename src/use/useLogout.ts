import { ActionType } from "@/models/store";
import touchIdStorageClient from "@/storage-client/touchId";
import router from "@/router";
import { useUserStore } from "@/store/user";
import { useAuthsStore } from "@/store/auth";
import { useListsStore } from "@/store/lists";
import { useProductsStore } from "@/store/products";
import { useProductsSelectionStore } from "@/store/products-selection";

export default function useLogout() {
  async function logout() {
    await useUserStore().action(ActionType.user.removeUser);
    await useListsStore().action(ActionType.lists.resetLists);
    await useProductsStore().action(ActionType.products.restoreStore);
    await useProductsSelectionStore().action(
      ActionType.productsSelection.restoreStore
    );
    await useAuthsStore().action(ActionType.auth.logout);
    await touchIdStorageClient.remove();
    await router.push("/auth");
  }

  return { logout };
}
