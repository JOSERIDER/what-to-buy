import { Product } from "@/models/domain/product";

export interface ProductFilterInterface {
  category: { text: string; id: number };
  minPrice: number;
  maxPrice: number;
  name: string;
}

export interface ProductsStateInterface {
  products: Product[];
  name: string;
  isDisableInfiniteScroll: boolean;
  filter: ProductFilterInterface;
  isFilter: boolean;
  loading: boolean;
  error: string;
  lastQuery: any;
}
