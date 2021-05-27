import { TouchIdModuleInterface } from "@/models/modules/touchID";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";

export class TouchIdPluginModelImp implements TouchIdModuleInterface {
  private readonly touchID: FingerprintAIO;

  constructor() {
    this.touchID = new FingerprintAIO();
  }

  isAvailable(): Promise<any> {
    return this.touchID.isAvailable();
  }

  show(): Promise<any> {
    return this.touchID.show({
      clientId: "Fingerprint-Demo",
      clientSecret: "password", // Only necessary for Android
      disableBackup: true, // Only for Android(optional)
      localizedFallbackTitle: "Use Pin", // Only for iOS
      localizedReason: "Please authenticate", // Only for iOS
    });
  }
}
