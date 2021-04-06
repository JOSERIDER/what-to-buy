import { Product } from "@/models/Product";

export interface ProductRepositoryInterface {
  getProduct(id: string): Promise<Product>;

  getProducts(): Promise<Product[]>;

  create(payload: Product);

  update(id: string, payload: Product);

  delete(id: string);
}
