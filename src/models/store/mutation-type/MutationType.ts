import { UserMutationType } from "@/models/store/user/UserMutationType";
import { ListsMutationType } from "@/models/store/lists/ListsMutationType";

/**
 * Is the main namespace that export and group the mutation type specific for each domain.
 */
export namespace MutationType {
  export const user = UserMutationType;
  export const lists = ListsMutationType;
}
