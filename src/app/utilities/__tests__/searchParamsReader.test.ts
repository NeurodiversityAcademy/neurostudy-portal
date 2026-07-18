import { EMPTY_SEARCH_PARAMS, readFirstSearchParamValue } from '@/app/utilities/searchParamsReader';

describe('searchParamsReader', () => {
  it('EMPTY_SEARCH_PARAMS is an empty object', () => {
    expect(EMPTY_SEARCH_PARAMS).toEqual({});
  });

  it('readFirstSearchParamValue returns string value', () => {
    expect(readFirstSearchParamValue({ demo: 'guid-1' }, 'demo')).toBe('guid-1');
  });

  it('readFirstSearchParamValue returns null when param absent', () => {
    expect(readFirstSearchParamValue({}, 'demo')).toBeNull();
  });

  it('readFirstSearchParamValue returns first array entry', () => {
    expect(readFirstSearchParamValue({ demo: ['a', 'b'] }, 'demo')).toBe('a');
  });

  it('readFirstSearchParamValue returns null for empty param key', () => {
    expect(readFirstSearchParamValue({ demo: 'x' }, '')).toBeNull();
  });
});
