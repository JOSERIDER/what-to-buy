import { ColorBuilder } from "@/utils/ColorBuilder";
import { IdBuilder } from "@/utils/IdBuilder";

export interface DataProduct {
  cant?: number;
  idProduct?: string;
}

export interface List {
  admin: string;
  listCode: string;
  color: string;
  name: string;
  products: DataProduct[];
}

export class ListBuild {
  public static build(admin: string, name: string): List {
    const color = ColorBuilder.getRandomColor();
    const listCode = IdBuilder.createIdentifier();

    return { admin, name, color, listCode, products: [] };
  }
}
