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
    process.env[ENDORSED_DEMO_ACCESS_ENV_KEY] = `{"${VALID_GUID}":"academia"}`;
    resetDemoAccessMapCacheForTests();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns internalSlug when path guid matches demo param', () => {
    expect(resolveDetailDemoAccess(VALID_GUID, { demo: VALID_GUID })).toEqual({
      internalSlug: 'academia',
    });
  });

  it('returns internalSlug for live provider slug without demo param', () => {
    expect(resolveDetailDemoAccess('hsh', EMPTY_SEARCH_PARAMS)).toEqual({
      internalSlug: 'hsh',
    });
    expect(
      resolveDetailDemoAccess(
        'blueprint-career-development',
        EMPTY_SEARCH_PARAMS
      )
    ).toEqual({
      internalSlug: 'blueprint-career-development',
    });
    expect(
      resolveDetailDemoAccess('nepean-community-college', EMPTY_SEARCH_PARAMS)
    ).toEqual({
      internalSlug: 'nepean-community-college',
    });
    expect(resolveDetailDemoAccess('collarts', EMPTY_SEARCH_PARAMS)).toEqual({
      internalSlug: 'collarts',
    });
  });

  it('returns null when demo param is missing for non-live guid path', () => {
    expect(resolveDetailDemoAccess(VALID_GUID, EMPTY_SEARCH_PARAMS)).toBeNull();
  });

  it('returns null when path guid differs from demo param', () => {
    expect(
      resolveDetailDemoAccess(VALID_GUID, {
        demo: '00000000-0000-0000-0000-000000000002',
      })
    ).toBeNull();
  });

  it('returns live slug for live provider even with demo param', () => {
    expect(resolveDetailDemoAccess('collarts', { demo: VALID_GUID })).toEqual({
      internalSlug: 'collarts',
    });
  });

  it('returns null for non-live known slug path even with valid demo param', () => {
    expect(
      resolveDetailDemoAccess('academia', { demo: VALID_GUID })
    ).toBeNull();
  });

  it('returns null for invalid guid with matching param', () => {
    expect(
      resolveDetailDemoAccess('invalid-guid', { demo: 'invalid-guid' })
    ).toBeNull();
  });
});
