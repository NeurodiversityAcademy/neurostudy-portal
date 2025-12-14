import HubspotResponse from '@/app/interfaces/HubspotResponse';
import axios, { AxiosResponse } from 'axios';

export async function updateHubspotSubscription(
  email: string,
  subscribed: boolean
): Promise<HubspotResponse> {
  const subscriptionId = process.env.HUBSPOT_SUBSCRIPTION_ID;
  const apiToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  const baseUrl = process.env.HUBSPOT_API_BASE_URL;

  if (!subscriptionId || !apiToken || !baseUrl) {
    throw new Error('HubSpot environment variables are not set');
  }

  const body = subscribed
    ? {
        emailAddress: email,
        legalBasis: 'CONSENT',
        subscriptionId: Number(subscriptionId),
      }
    : {
        emailAddress: email,
        status: 'UNSUBSCRIBED',
        subscriptionId: Number(subscriptionId),
      };

  try {
    const res: AxiosResponse<HubspotResponse> = await axios.post(
      `${baseUrl}/communication-preferences/v3/subscribe`,
      body,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        '[HubSpot] API error:',
        err.response?.status,
        err.response?.data
      );
    } else if (err instanceof Error) {
      console.error('[HubSpot] Error:', err.message);
    } else {
      console.error('[HubSpot] Unknown error:', err);
    }

    throw err;
  }
}
