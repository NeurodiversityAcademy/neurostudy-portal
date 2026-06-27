import {
  ENDORSED_DEMO_ACCESS_ENV_KEY,
  resetDemoAccessMapCacheForTests,
  resolveDetailDemoAccess,
} from '../demoAccess';
import { EMPTY_SEARCH_PARAMS } from '../searchParamsReader';

const ORIGINAL_ENV = process.env;
const VALID_GUID = '00000000-0000-0000-0000-000000000001';

describe('resolveDetailDemoAccess', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env[ENDORSED_DEMO_ACCESS_ENV_KEY] = `{"${VALID_GUID}":"collarts"}`;
    resetDemoAccessMapCacheForTests();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns internalSlug when path guid matches demo param', () => {
    expect(resolveDetailDemoAccess(VALID_GUID, { demo: VALID_GUID })).toEqual({
      internalSlug: 'collarts',
    });
  });

  it('returns null when demo param is missing', () => {
    expect(resolveDetailDemoAccess(VALID_GUID, EMPTY_SEARCH_PARAMS)).toBeNull();
  });

  it('returns null when path guid differs from demo param', () => {
    expect(
      resolveDetailDemoAccess(VALID_GUID, {
        demo: '00000000-0000-0000-0000-000000000002',
      })
    ).toBeNull();
  });

  it('returns null for slug path even with valid demo param', () => {
    expect(
      resolveDetailDemoAccess('collarts', { demo: VALID_GUID })
    ).toBeNull();
  });

  it('returns null for invalid guid with matching param', () => {
    expect(
      resolveDetailDemoAccess('invalid-guid', { demo: 'invalid-guid' })
    ).toBeNull();
  });
});
