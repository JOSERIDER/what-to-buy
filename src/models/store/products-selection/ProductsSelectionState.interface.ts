import { Product } from "@/models/domain/product";

export interface ProductSelectionType {
  product?: Product;
  selected?: boolean;
}

export interface ProductsSelectionStateInterface {
  products: ProductSelectionType[];
  loading: boolean;
  error: string;
}
