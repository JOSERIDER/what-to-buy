import { List } from "@/models/domain/list/ListDomain.interface";

/**
 * Interface that represent the SharedList object. It provide a type.
 * @implements List.
 */
export interface SharedList extends List {
  users: string[];
}
