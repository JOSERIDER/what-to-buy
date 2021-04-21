import { ColorBuilder } from "@/utils/ColorBuilder";
import { IdBuilder } from "@/utils/IdBuilder";
import { SharedList } from "@/models/domain/sharedList/SharedListDomain.interface";

/**
 * Class to build a SharedList object.
 */
export class SharedListBuild {
  /**
   * Build a SharedList object with given arguments.
   * @param admin - user that is the owner.
   * @param name - name of list.
   * @return The SharedList object.
   */
  public static build(admin: string, name: string): SharedList {
    const color = ColorBuilder.getRandomColor();
    const listCode = IdBuilder.createIdentifier();

    return { admin, name, color, listCode, users: [admin], products: [] };
  }
}
