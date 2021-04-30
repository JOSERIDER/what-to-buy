import { Product } from "@/models/domain/product";

export interface ProductsSelectionStateInterface {
  products: { product?: Product; selected?: boolean }[];
  loading: boolean;
  error: string;
}
