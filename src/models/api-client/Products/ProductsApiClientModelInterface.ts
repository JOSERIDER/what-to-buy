import { Product } from "@/models/Product";

/**
 * @Name ProductsApiClientModelInterface
 * @Description Interface for ProductsApiClientModelInterface.
 */
export interface ProductsApiClientModelInterface {
  /**
   * Obtain a product by given id.
   * @param id - Id of product.
   * @return Return the product by given id.
   */
  get(id: string): Promise<Product>;

  /**
   * Obtains all products on database,
   * @return Return an array that contains all products on database.
   */
  getProducts(): Promise<Product[]>;

  /**
   * Create a product on database.
   * @param payload - product object to be created.
   */
  create(payload: Product): Promise<void>;

  /**
   * Update a product on database.
   * @param id - product id to be updated.
   * @param payload - Product object to be updated.
   */
  update(id: string, payload: Product): Promise<void>;

  /**
   * Delete a product by given id on database.
   * @param id - Id of product to be deleted.
   */
  delete(id: string): Promise<void>;
}
