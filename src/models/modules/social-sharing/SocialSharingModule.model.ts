import socialSharing from "@/plugins/social-sharing";
import { SocialSharingModelInterface } from "./SocialSharingModule.interface";

export class SocialSharing implements SocialSharingModelInterface {
  share(message: string): Promise<any> {
    return socialSharing.share(message);
  }
}
