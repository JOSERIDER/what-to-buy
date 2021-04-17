import { Product } from "@/models/Product";

export interface ProductsApiClientModelInterface {
  getProduct(id: string): Promise<Product>;

  getProducts(): Promise<Product[]>;

  create(payload: Product): Promise<void>;

  update(id: string, payload: Product): Promise<void>;

  delete(id: string): Promise<void>;
}
