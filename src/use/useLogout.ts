import { ActionType } from "@/models/store";
import touchIdStorageClient from "@/storage-client/touchId";
import router from "@/router";
import { useUserStore } from "@/store/user";
import { useAuthsStore } from "@/store/auth";
import { useListsStore } from "@/store/lists";
import { useProductsStore } from "@/store/products";
import { useProductsSelectionStore } from "@/store/products-selection";
import { firebaseAuth } from "@/api-client";

export default function useLogout() {
  const userStore = useUserStore();
  async function logout() {
    await userStore.action(ActionType.user.removeUser);
    await useListsStore().action(ActionType.lists.resetLists);
    await useProductsStore().action(ActionType.products.restoreStore);
    await useProductsSelectionStore().action(
      ActionType.productsSelection.restoreStore
    );
    await useAuthsStore().action(ActionType.auth.logout);
    await touchIdStorageClient.remove();
    await router.push("/auth");
  }

  async function deleteAccount() {
    await userStore.action(
      ActionType.user.deleteUser,
      firebaseAuth.currentUser?.uid
    );
    await firebaseAuth.currentUser?.delete();
    await logout();
  }

  return { logout, deleteAccount };
}
