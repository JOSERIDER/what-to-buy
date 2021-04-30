import { ProductsSelectionStateInterface } from "@/models/store/products-selection";

export const initialState: ProductsSelectionStateInterface = {
  products: [],
  loading: false,
  error: "",
};
