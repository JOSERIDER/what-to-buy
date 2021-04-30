import { Product } from "@/models/domain/product";

export interface ProductsStateInterface {
  products: Product[];
  loading: boolean;
  error: string;
}
