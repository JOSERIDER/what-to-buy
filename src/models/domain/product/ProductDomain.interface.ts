/**
 * Interface that represent the product object. It provide a type.
 */
export interface Product {
  id?: string;
  name?: string;
  image?: string;
  description?: string;
  price?: number;
  category?: string;
  quantity?: number;
}
