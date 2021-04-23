import Vuex from "vuex";
import { RootStoreInterface } from "@/models/store/root/RootStore.interface";

/**
 * Extends the vuex declaration with RootStoreInterface.
 * @name RootStoreModel
 * @extends Vuex.store
 * @implements RootStoreInterface
 */
export class RootStoreModel<S> extends Vuex.Store<RootStoreInterface> {}
