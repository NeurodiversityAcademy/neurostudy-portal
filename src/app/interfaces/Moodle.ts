export interface MoodleUserBasic {
  id: number;
  username: string;
}

interface MoodleUserPreference {
  name: string;
  value: string | number;
}

export interface MoodleUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  department: string;
  firstaccess: number;
  lastaccess: number;
  auth: string;
  suspended: boolean;
  confirmed: boolean;
  lang: string;
  theme: string;
  timezone: string;
  mailformat: number;
  description: string;
  descriptionformat: number;
  city: string;
  country: string;
  profileimageurlsmall: string;
  profileimageurl: string;
  preferences: MoodleUserPreference[];
}
