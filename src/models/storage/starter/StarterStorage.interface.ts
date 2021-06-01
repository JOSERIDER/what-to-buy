export interface StarterStorageInterface {
  get(): Promise<boolean>;

  set(user: boolean): Promise<boolean>;

  remove(): Promise<void>;
}
