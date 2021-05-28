export interface TouchIdModuleInterface {
  show(): Promise<any>;
  isAvailable(): Promise<any>;
}
