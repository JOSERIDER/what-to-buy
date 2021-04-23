/**
 * Represent scaner plugin. This interface acts as an abstraction.
 */
export interface BarcodeScannerInterface {
  scan(): Promise<string>;
}
