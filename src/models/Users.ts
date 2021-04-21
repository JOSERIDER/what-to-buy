export interface User {
  id?: string;
  email?: string;
  name?: string;
  mySharedList?: string;
  qrUrl?: string;
  image?: string;
}

export class UserBuild {
  private static qrURL = (id: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?data=${id}&size=200x200`;

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
