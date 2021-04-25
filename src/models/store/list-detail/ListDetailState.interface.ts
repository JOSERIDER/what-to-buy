import { Product } from "@/models/domain/product";
import { List } from "@/models/domain/list";

export interface ListDetailStateInterface {
  products: Product[];
  loading: boolean;
  summary: number;
  error: string;
  list: List;
}
