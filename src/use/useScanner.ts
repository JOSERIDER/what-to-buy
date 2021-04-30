import barcodeScanner from "@/module-client/barcode-scanner";
import useIonicService from "@/use/useIonicService";

export default function useScanner(onResponse) {
  const { toast } = useIonicService();

  barcodeScanner
    .scan()
    .then(resp => onResponse(resp))
    .catch(async () => {
      await toast({
        message: "Scanner no available.",
        duration: 2000,
      });
    });
}
