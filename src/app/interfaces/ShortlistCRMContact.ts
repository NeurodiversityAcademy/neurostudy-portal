export type ShortlistVerifyStatus = 'pending' | 'verified' | 'bounced';

/**
 * HubSpot contact properties used by the shortlist flow.
 *
 * These must exist as custom contact properties before the route is enabled.
 * HubSpot rejects unknown properties.
 */
export interface ShortlistCRMContact {
  email: string;
  nda_source: 'search_shortlist';
  nda_consent_version: string;
  /** ISO timestamp, doubles as the double opt-in issue time. */
  nda_shortlist_unlocked_at: string;
  nda_verify_token: string;
  nda_verify_status: ShortlistVerifyStatus;
}
