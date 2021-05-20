import { Product } from "@/models/domain/product";
import { List } from "@/models/domain/list";
import { SharedList } from "@/models/domain/sharedList";

export interface ListDetailStateInterface {
  products: Product[];
  loading: boolean;
  summary: number;
  error: string;
  list: List | SharedList;
  type: string;
}
