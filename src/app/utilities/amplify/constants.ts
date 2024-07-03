export enum AUTH_EVENT_TYPE {
  SIGNED_IN = 'signedIn',
  SIGNED_OUT = 'signedOut',
}

export type PayloadType = { event: AUTH_EVENT_TYPE; data: unknown } & {
  message?: string | undefined;
};
