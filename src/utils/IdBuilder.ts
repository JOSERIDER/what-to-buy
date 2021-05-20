export class IdBuilder {
  public static createIdentifier(): string {
    return new Date().getTime().toString();
  }
}
