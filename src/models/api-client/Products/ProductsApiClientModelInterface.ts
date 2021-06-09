/**
 * @Name ProductsApiClientModelInterface
 * @Description Interface for ProductsApiClientModelInterface.
 */
import { Product } from "@/models/domain/product";
import { ProductFilterInterface } from "@/models/store";

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
   * Check if the product already exists in database.
   * @param barcode - barcode of product to check
   */
  checkProductBarcode(barcode: string): Promise<boolean>;

  /**
   * Check if the product already exists in database.
   * @param name - name of product to check
   */
  checkProductName(name: string): Promise<boolean>;

  /**
   * Obtains products that have name like value of param
   * @param name - value to search products
   * @return Return an array that contains all products with name as value..
   */
  getProductsByName(name: string): Promise<Product[]>;

  /**
   * Obtains products that have name like value of param
   * @return Return an array that contains all products with name as value..
   * @param barcode -
   */
  getProductByBarcode(barcode: string): Promise<Product>;

  /**
   *
   * Obtains products that pass the filtering criteria.
   * @param filter - filtering criteria
   */
  getFilterProducts(filter: ProductFilterInterface): Promise<Product[]>;

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

  /**
   * Obtains the products by an array
   * @param productsId = Id of products to be obtained.
   * @return An array that contains all products on the param array.
   */
  getProductsById(productsId: string[]): Promise<Product[]>;
}
