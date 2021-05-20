import { SocialSharingModelInterface } from "@/models/modules/social-sharing";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

export class SocialSharingPluginImp implements SocialSharingModelInterface {
  private readonly socialSharing: SocialSharing;

  constructor() {
    this.socialSharing = new SocialSharing();
  }

  share(message: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socialSharing
        .share(message)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }
}
