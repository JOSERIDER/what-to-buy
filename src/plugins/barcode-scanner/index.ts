import { BarcodeScannerInterface } from "@/models/modules/barcode-scanner";
import { ScannerImp } from "./BarcodeScanner.model";

const scanner: BarcodeScannerInterface = new ScannerImp();

export default scanner;
