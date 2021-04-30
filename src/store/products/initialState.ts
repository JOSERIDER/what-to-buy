import { ProductsStateInterface } from "@/models/store/products";

export const initialState: ProductsStateInterface = {
  products: [],
  loading: false,
  error: "",
};
