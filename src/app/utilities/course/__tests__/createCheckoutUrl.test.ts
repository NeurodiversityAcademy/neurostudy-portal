import axios from 'axios';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

import createCheckoutUrl from '../createCheckoutUrl';

describe('createCheckoutUrl', () => {
  it('returns checkout session data from API', async () => {
    const mockData = { url: 'https://checkout.stripe.com/session_123' };
    mockAxios.request.mockResolvedValue({ data: mockData });

    const result = await createCheckoutUrl();

    expect(result).toEqual(mockData);
    expect(mockAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('/course/createCheckoutUrl') }),
    );
  });

  it('propagates errors from axios', async () => {
    mockAxios.request.mockRejectedValue(new Error('Network error'));

    await expect(createCheckoutUrl()).rejects.toThrow('Network error');
  });
});
