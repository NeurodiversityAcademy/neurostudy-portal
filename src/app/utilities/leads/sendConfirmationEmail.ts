import 'server-only';

/**
 * Double opt-in delivery.
 *
 * The site has no transactional email provider wired up yet. Rather than pretend,
 * this adapter posts to an explicitly configured webhook (Sender.net automation,
 * Zapier, or a transactional service). When unconfigured it returns false and the
 * lead stays `pending` — never `verified`, and never marketed to.
 */
export async function sendShortlistConfirmationEmail(params: {
  email: string;
  confirmUrl: string;
}): Promise<boolean> {
  const webhookUrl = process.env.SHORTLIST_CONFIRM_WEBHOOK_URL;
  if (!webhookUrl) {
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.SHORTLIST_CONFIRM_WEBHOOK_TOKEN
          ? { authorization: `Bearer ${process.env.SHORTLIST_CONFIRM_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        email: params.email,
        confirmUrl: params.confirmUrl,
        template: 'shortlist_confirm',
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
