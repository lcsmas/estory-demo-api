export interface User {
  id: number;
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  ch_rand: string;
  validated: boolean;
  oauth_provider: string;
  oauth_uid: string;
  gender: string;
  picture: string;
  description: string;
  old_user: boolean;
  validation_date: string;
  last_logged_date: string;
}
