import { Product } from "@/models/domain/product";
import { DataProduct } from "@/models/domain/list";

export interface ProductsSelectionStateInterface {
  products: Product[];
  productsSelected: DataProduct[];
  loading: boolean;
  error: string;
  lastQuery: any;
  isDisableInfiniteScroll: boolean;
  name: string;
  filter: any;
  isFilter: boolean;
}
