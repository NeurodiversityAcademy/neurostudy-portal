import {
  DEMO_PASS_PARAM,
  ENDORSED_DEMO_ACCESS_ENV_KEY,
  ENDORSED_PROVIDERS_BASE_PATH,
  buildEndorsedDemoDetailHref,
  buildEndorsedDemoHomeHref,
  buildEndorsedLiveDetailHref,
  isValidDemoGuid,
  parseDemoAccessMap,
  readDemoGuidFromSearchParams,
  resetDemoAccessMapCacheForTests,
  resolveGuidToSlug,
  resolveHomeDemoAccess,
} from '../demoAccess';

const ORIGINAL_ENV = process.env;

describe('DEMO_PASS_PARAM', () => {
  it('equals demo', () => {
    expect(DEMO_PASS_PARAM).toBe('demo');
  });
});

describe('parseDemoAccessMap', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env[ENDORSED_DEMO_ACCESS_ENV_KEY];
    resetDemoAccessMapCacheForTests();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns empty map when env unset', () => {
    expect(parseDemoAccessMap()).toEqual({});
  });

  it('parses valid JSON guid-to-slug map', () => {
    process.env[ENDORSED_DEMO_ACCESS_ENV_KEY] =
      '{"guid-1":"collarts","guid-2":"bond-university"}';
    expect(parseDemoAccessMap()).toEqual({
      'guid-1': 'collarts',
      'guid-2': 'bond-university',
    });
  });

  it('returns empty map on malformed JSON without throwing', () => {
    process.env[ENDORSED_DEMO_ACCESS_ENV_KEY] = '{not-valid-json';
    expect(parseDemoAccessMap()).toEqual({});
  });
});

describe('isValidDemoGuid', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env[ENDORSED_DEMO_ACCESS_ENV_KEY] = '{"guid-1":"collarts"}';
    resetDemoAccessMapCacheForTests();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns true for known guid', () => {
    expect(isValidDemoGuid('guid-1')).toBe(true);
  });

  it('returns false for unknown guid', () => {
    expect(isValidDemoGuid('unknown-guid')).toBe(false);
  });
});

describe('resolveGuidToSlug', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env[ENDORSED_DEMO_ACCESS_ENV_KEY] = '{"guid-1":"collarts"}';
    resetDemoAccessMapCacheForTests();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('resolves known guid to internal slug', () => {
    expect(resolveGuidToSlug('guid-1')).toBe('collarts');
  });

  it('returns null for unknown guid', () => {
    expect(resolveGuidToSlug('unknown-guid')).toBeNull();
  });
});

describe('readDemoGuidFromSearchParams', () => {
  it('returns guid when demo param is a string', () => {
    expect(readDemoGuidFromSearchParams({ demo: 'guid-1' })).toBe('guid-1');
  });

  it('returns null when demo param is absent', () => {
    expect(readDemoGuidFromSearchParams({})).toBeNull();
  });

  it('returns first value when demo param is an array', () => {
    expect(readDemoGuidFromSearchParams({ demo: ['a', 'b'] })).toBe('a');
  });
});

describe('buildEndorsedDemoDetailHref', () => {
  it('returns guid path with matching demo query param', () => {
    expect(buildEndorsedDemoDetailHref('abc-guid')).toBe(
      `${ENDORSED_PROVIDERS_BASE_PATH}/abc-guid?demo=abc-guid`
    );
  });

  it('returns empty string for empty guid', () => {
    expect(buildEndorsedDemoDetailHref('')).toBe('');
  });
});

describe('buildEndorsedLiveDetailHref', () => {
  it('returns slug path without demo query param', () => {
    expect(buildEndorsedLiveDetailHref('hsh')).toBe(
      `${ENDORSED_PROVIDERS_BASE_PATH}/hsh`
    );
  });

  it('returns empty string for empty slug', () => {
    expect(buildEndorsedLiveDetailHref('')).toBe('');
  });
});

describe('buildEndorsedDemoHomeHref', () => {
  it('returns home path with demo query param', () => {
    expect(buildEndorsedDemoHomeHref('abc-guid')).toBe('/?demo=abc-guid');
  });

  it('returns empty string for empty guid', () => {
    expect(buildEndorsedDemoHomeHref('')).toBe('');
  });
});

describe('resolveHomeDemoAccess', () => {
  const VALID_GUID = '00000000-0000-0000-0000-000000000001';
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env[ENDORSED_DEMO_ACCESS_ENV_KEY] = `{"${VALID_GUID}":"collarts"}`;
    resetDemoAccessMapCacheForTests();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns null when demo param is absent', () => {
    expect(resolveHomeDemoAccess({})).toBeNull();
  });

  it('returns demoGuid and demoSlug for valid demo param', () => {
    expect(resolveHomeDemoAccess({ demo: VALID_GUID })).toEqual({
      demoGuid: VALID_GUID,
      demoSlug: 'collarts',
    });
  });

  it('returns null for invalid demo guid', () => {
    expect(resolveHomeDemoAccess({ demo: 'invalid-guid' })).toBeNull();
  });
});
