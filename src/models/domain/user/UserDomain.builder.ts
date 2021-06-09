import { User } from "@/models/domain/user/UserDomain.interface";

/**
 * Class to encapsulate the logic and responsibility to build a User object.
 * */
export class UserBuild {
  private static qrURL = (id: string) => id;

  /**
   * Build a User object.
   * @param id - User id.
   * @param email - User email.
   * @param name - User name.
   * @param mySharedList - List code of shared list that user is the owner.
   */
  public static build(
    id: string,
    email: string,
    name: string,
    mySharedList: string
  ): User {
    const qrUrl = this.qrURL(mySharedList);
    return {
      id,
      email,
      name,
      mySharedList,
      qrUrl,
    };
  }
}
