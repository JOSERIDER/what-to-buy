export interface TouchIdStorageInterface {
  get(): Promise<boolean>;

  set(user: boolean): Promise<boolean>;

  remove(): Promise<void>;
}
