/**
 * @jest-environment node
 */
const mockStripeConstructor = jest.fn();

jest.mock('stripe', () => ({
  __esModule: true,
  default: mockStripeConstructor,
}));

jest.mock('../helper', () => ({
  getStripeSecret: () => 'sk_test_mock_secret',
}));

describe('getStripe', () => {
  beforeEach(() => {
    jest.resetModules();
    mockStripeConstructor.mockClear();
    mockStripeConstructor.mockImplementation(() => ({ apiKey: 'sk_test_mock_secret' }));
  });

  it('lazy-loads Stripe with the configured secret and API version', async () => {
    const getStripe = (await import('../getStripe')).default;

    const instance = getStripe();

    expect(mockStripeConstructor).toHaveBeenCalledTimes(1);
    expect(mockStripeConstructor).toHaveBeenCalledWith('sk_test_mock_secret', {
      apiVersion: '2026-06-24.dahlia',
    });
    expect(instance).toEqual({ apiKey: 'sk_test_mock_secret' });
  });

  it('returns the same Stripe instance on subsequent calls', async () => {
    const getStripe = (await import('../getStripe')).default;

    const first = getStripe();
    const second = getStripe();

    expect(mockStripeConstructor).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
  });
});
