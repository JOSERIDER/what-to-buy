/**
 * Interface that represent the user object. Is used to provide a type.
 */
export interface User {
  id?: string;
  email?: string;
  name?: string;
  mySharedList?: string;
  qrUrl?: string;
  image?: string;
}
