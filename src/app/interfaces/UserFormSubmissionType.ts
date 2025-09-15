import { HSPersona } from './UserSubscriptionType';

export interface UserFormSubmissionType {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
  hs_persona: HSPersona;
}
