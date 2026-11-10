type SenderGroupType =
  | 'Parent/Carers'
  | 'Ally/Advocate'
  | 'Education Professionals'
  | 'Education Providers'
  | 'Students';

const GROUP_ID_MAP: Record<SenderGroupType, string> = {
  'Parent/Carers': 'aO6N5r',
  'Ally/Advocate': 'dRjQ5E',
  'Education Professionals': 'aQgP59',
  'Education Providers': 'dPWO54',
  Students: 'dNWM5v',
};

const PERSONA_TO_GROUP_MAP: Record<string, SenderGroupType> = {
  persona_1: 'Students',
  persona_2: 'Education Providers',
  persona_3: 'Education Professionals',
  persona_4: 'Parent/Carers',
  persona_5: 'Ally/Advocate',
};

export interface SenderContactParams {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  fields?: Record<string, string | number>;
  trigger_automation?: boolean;
}

export interface SenderContactResponse {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  groups: string[];
  fields?: Record<string, string | number>;
  trigger_automation?: boolean;
}

export async function registerSenderContact(
  contact: SenderContactParams,
  personaValue: string,
): Promise<SenderContactResponse | null> {
  try {
    const senderBaseUrl = process.env.SENDER_BASE_URL;
    const senderAccessToken = process.env.SENDER_ACCESS_TOKEN;

    if (!senderBaseUrl || !senderAccessToken) {
      console.warn('Sender contact registration skipped: missing Sender configuration');
      return null;
    }

    const url = `${senderBaseUrl.replace(/\/+$/, '')}/subscribers`;

    const groupType = PERSONA_TO_GROUP_MAP[personaValue];
    if (!groupType) {
      // Unknown/new personas (e.g. `other`) are skipped rather than thrown.
      // Callers already treat a null response as "sender contact not created".
      return null;
    }

    const payload = {
      ...contact,
      groups: [GROUP_ID_MAP[groupType]],
      trigger_automation: false,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${senderAccessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Sender API Error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseData,
      });
      return null;
    }

    return responseData;
  } catch {
    return null;
  }
}
