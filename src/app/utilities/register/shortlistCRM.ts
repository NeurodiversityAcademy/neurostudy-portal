import 'server-only';
import type { ShortlistCRMContact } from '@/app/interfaces/ShortlistCRMContact';

type CRMContactRecord = {
  id: string;
  properties: Record<string, string | null>;
};

const VERIFY_PROPERTIES = [
  'email',
  'nda_verify_status',
  'nda_verify_token',
  'nda_shortlist_unlocked_at',
] as const;

function crmUrl(path: string): string {
  return `${process.env.CRM_BASE_URL}${path}`;
}

function crmHeaders(): Record<string, string> {
  return {
    authorization: `Bearer ${process.env.CRM_ACCESS_KEY}`,
    'content-type': 'application/json',
  };
}

/** Returns the contact holding `value` in `property`, or `null`. */
export async function findCRMContactByProperty(
  property: keyof ShortlistCRMContact | 'email',
  value: string,
): Promise<CRMContactRecord | null> {
  try {
    const response = await fetch(crmUrl('/objects/contacts/search'), {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [{ propertyName: property, operator: 'EQ', value }],
          },
        ],
        properties: [...VERIFY_PROPERTIES],
        limit: 1,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { results?: CRMContactRecord[] };
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}

/** Applies properties to an existing contact. Returns false on any failure. */
export async function updateCRMContact(
  contactId: string,
  properties: Partial<ShortlistCRMContact>,
): Promise<boolean> {
  try {
    const response = await fetch(crmUrl(`/objects/contacts/${encodeURIComponent(contactId)}`), {
      method: 'PATCH',
      headers: crmHeaders(),
      body: JSON.stringify({ properties }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
