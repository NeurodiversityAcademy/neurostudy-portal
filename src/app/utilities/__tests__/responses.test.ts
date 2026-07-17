/**
 * @jest-environment node
 */
import { returnBadResponse } from '@/app/utilities/responses';

describe('returnBadResponse', () => {
  it('returns a 400 response by default', async () => {
    const response = returnBadResponse();
    expect(response.status).toBe(400);
    expect(response.statusText).toBe('Bad Request');

    const body = await response.json();
    expect(body).toEqual({ error: 'Bad Request' });
  });

  it('merges additional info into the response body', async () => {
    const response = returnBadResponse({ field: 'email', detail: 'invalid' });
    const body = await response.json();
    expect(body).toEqual({
      error: 'Bad Request',
      field: 'email',
      detail: 'invalid',
    });
  });

  it('allows overriding the status code', async () => {
    const response = returnBadResponse({ reason: 'conflict' }, 409);
    expect(response.status).toBe(409);
  });

  it('sets Content-Type header to application/json', () => {
    const response = returnBadResponse();
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });
});
