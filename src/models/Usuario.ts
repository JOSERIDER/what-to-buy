export interface User {
  id: string;
  email: string;
  image?: string;
  name: string;
  sharedList?: string[];
  privateList?: string[];
  qrUrl?: string;
  mysharedList?: string;
}
