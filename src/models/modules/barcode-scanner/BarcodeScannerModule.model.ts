import scanner from "@/plugins/barcode-scanner";
import { BarcodeScannerInterface } from "./BarcodeScannerModule.interface";

export class BarcodeScannerModel implements BarcodeScannerInterface {
  scan(): Promise<string> {
    return scanner.scan();
  }
}
