import { isProductionAnalyticsEnabled } from '../analyticsEnv';

describe('isProductionAnalyticsEnabled', () => {
  const original = process.env.NEXT_PUBLIC_VERCEL_ENV;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    } else {
      process.env.NEXT_PUBLIC_VERCEL_ENV = original;
    }
  });

  it('is true only for Vercel production', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
    expect(isProductionAnalyticsEnabled()).toBe(true);
  });

  it('is false for preview, development, and unset', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
    expect(isProductionAnalyticsEnabled()).toBe(false);

    process.env.NEXT_PUBLIC_VERCEL_ENV = 'development';
    expect(isProductionAnalyticsEnabled()).toBe(false);

    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    expect(isProductionAnalyticsEnabled()).toBe(false);
  });
});
