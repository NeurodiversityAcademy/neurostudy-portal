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
  fullname?: string;
  email: string;
  department?: string;
  firstaccess?: number;
  lastaccess?: number;
  auth?: string;
  suspended?: boolean;
  confirmed?: boolean;
  lang?: string;
  theme?: string;
  timezone?: string;
  mailformat?: number;
  description?: string;
  descriptionformat?: number;
  city?: string;
  country?: string;
  profileimageurlsmall?: string;
  profileimageurl?: string;
  preferences?: MoodleUserPreference[];
}

export interface MoodleCourse {
  id: number;
  shortname: string;
  fullname: string;
  displayname?: string;
  enrolledusercount?: number;
  idnumber: string;
  visible: number;
  summary?: string;
  format?: string;
  courseimage?: string;
  startdate: number;
  enddate: number;
}

export interface MoodleException {
  exception: string;
  errorcode: string;
  message: string;
}
