import { ColorBuilder } from "@/utils/ColorBuilder";
import { IdBuilder } from "@/utils/IdBuilder";
import { List } from "@/models/domain/list/ListDomain.interface";

/**
 * Class to encapsulate the logic and responsibility to build a List object.
 * */
export class ListBuild {
  /**
   * Build a list object from the given params.
   * @param admin - Id of user to be the admin.
   * @param name - Name of list.
   * @return The list object.
   */
  public static build(admin: string, name: string): List {
    const color = ColorBuilder.getRandomColor();
    const listCode = IdBuilder.createIdentifier();

    return { admin, name, color, listCode, products: [] };
  }
}
