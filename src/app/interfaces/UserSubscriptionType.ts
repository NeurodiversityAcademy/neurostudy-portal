export type HSPersona =
  | 'persona_1'
  | 'persona_2'
  | 'persona_3'
  | 'persona_4'
  | 'persona_5'
  | 'other';

export interface UserSubscriptionType {
  email: string;
  hs_persona: HSPersona;
  firstName?: string;
  lastName?: string;
}

export type UserSubscriptionHandbookType = {
  email: string;
  hs_persona: HSPersona;
  getHandbook?: true;
};
