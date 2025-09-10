export interface UserSubscriptionType {
  email: string;
  hs_persona: string;
}

export type UserSubscriptionHandbookType = {
  email: string;
  getHandbook?: true;
};
