import { ProductsSelectionStateInterface } from "@/models/store/products-selection";

export const initialState: ProductsSelectionStateInterface = {
  products: [],
  productsSelected: [],
  loading: false,
  error: "",
};
