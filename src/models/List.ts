export interface SharedList extends List {
  users?: string[];
  admin?: string;
}

export interface List {
  listCode: string;
  color: string;
  name: string;
  products?: DataProduct[];
}

export interface DataProduct {
  cant?: number;
  idProduct?: string;
}
