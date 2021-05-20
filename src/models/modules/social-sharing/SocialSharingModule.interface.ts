export interface SocialSharingModelInterface {
  share(message: string): Promise<any>;
}