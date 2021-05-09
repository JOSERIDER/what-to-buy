import { Product } from "@/models/domain/product";

export interface ProductFilterInterface {
  category: { text: string; id: number };
  minPrice: number;
  maxPrice: number;
  name: string;
}

export interface ProductsStateInterface {
  products: Product[];
  filter: ProductFilterInterface;
  loading: boolean;
  error: string;
}
