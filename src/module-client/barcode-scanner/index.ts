import { BarcodeScannerInterface } from "@/models/modules/barcode-scanner";
import { BarcodeScannerImp } from "@/plugins/barcode-scanner";

const barcodeScanner: BarcodeScannerInterface = new BarcodeScannerImp();

export default barcodeScanner;
