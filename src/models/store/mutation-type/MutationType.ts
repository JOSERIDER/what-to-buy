import { UserMutationType } from "@/models/store/user/UserMutationType";

/**
 * Is the main namespace that export and group the mutation type specific for each domain.
 */
export namespace MutationType {
  export const user = UserMutationType;
}
