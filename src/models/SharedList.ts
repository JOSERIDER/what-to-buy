import { ColorBuilder } from "@/utils/ColorBuilder";
import { IdBuilder } from "@/utils/IdBuilder";
import { List } from "@/models/List";

export interface SharedList extends List {
  users: string[];
}

export class SharedListBuild {
  public static build(admin: string, name: string): SharedList {
    const color = ColorBuilder.getRandomColor();
    const listCode = IdBuilder.createIdentifier();

    return { admin, name, color, listCode, users: [], products: [] };
  }
}
