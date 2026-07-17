/**
 * @jest-environment node
 */
import { installFetchMock, mockJsonResponse, restoreFetch } from '@/testUtils/mockFetch';
import { registerSenderContact } from '../registerSenderContact';

describe('registerSenderContact', () => {
  const originalEnv = process.env;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = installFetchMock();
    process.env = {
      ...originalEnv,
      SENDER_BASE_URL: 'https://sender.example.com',
      SENDER_ACCESS_TOKEN: 'sender-token',
    };
  });

  afterEach(() => {
    restoreFetch();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('creates a sender subscriber for a known persona', async () => {
    const response = {
      id: 'sub-1',
      email: 'jane@example.com',
      groups: ['dNWM5v'],
    };
    fetchMock.mockResolvedValue(mockJsonResponse(response));

    const result = await registerSenderContact(
      { email: 'jane@example.com', firstname: 'Jane' },
      'persona_1',
    );

    expect(result).toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://sender.example.com/subscribers',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sender-token',
        }),
      }),
    );

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.groups).toEqual(['dNWM5v']);
    expect(body.trigger_automation).toBe(false);
  });

  it('returns null for an invalid persona', async () => {
    const result = await registerSenderContact({ email: 'jane@example.com' }, 'persona_unknown');

    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null when the sender API responds with an error', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    fetchMock.mockResolvedValue(mockJsonResponse({ error: 'denied' }, 400));

    const result = await registerSenderContact({ email: 'jane@example.com' }, 'persona_1');

    expect(result).toBeNull();
    errorSpy.mockRestore();
  });

  it('returns null when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));

    await expect(
      registerSenderContact({ email: 'jane@example.com' }, 'persona_1'),
    ).resolves.toBeNull();
  });
});
