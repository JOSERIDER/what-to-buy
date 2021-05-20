/**
 * Interface that represent the product amount and id.
 */
export interface DataProduct {
  cant?: number;
  idProduct?: string;
}

/**
 * Interface thar represent the list object.
 */
export interface List {
  admin: string;
  listCode: string;
  color: string;
  name: string;
  products: DataProduct[];
}
