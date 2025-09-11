export interface UserSubscriptionType {
  email: string;
  hs_persona:
    | 'student'
    | 'educationProvider'
    | 'educationProfessionals'
    | 'parent'
    | 'ally'
    | 'persona_1'
    | 'other';
}

export type UserSubscriptionHandbookType = {
  email: string;
  hs_persona:
    | 'student'
    | 'educationProvider'
    | 'educationProfessionals'
    | 'parent'
    | 'ally'
    | 'persona_1'
    | 'other';
  getHandbook?: true;
};
