import { BarcodeScannerInterface } from "@/models/modules/barcode-scanner";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

/**
 * Wrap the scanner funcionality to abstract the componet use the plugin directly.
 */
export class ScannerImp implements BarcodeScannerInterface {
  private readonly scanner: BarcodeScanner;

  constructor() {
    this.scanner = new BarcodeScanner();
  }

  scan(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.scanner
        .scan()
        .then(response => {
          resolve(response.text);
        })
        .catch(error => reject(error));
    });
  }
}
