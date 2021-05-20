import { SocialSharingModelInterface } from "@/models/modules/social-sharing";
import { SocialSharingPluginImp } from "@/plugins/social-sharing";

const socialSharing: SocialSharingModelInterface = new SocialSharingPluginImp();

export default socialSharing;
