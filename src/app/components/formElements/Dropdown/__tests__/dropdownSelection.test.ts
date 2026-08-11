import {
  buildOptionLookup,
  buildSelectedLookup,
  canCreateOption,
  fieldValueFromSelection,
  filterSearchableOptions,
  nextSelectedValues,
  resolveDisplayInputValue,
  toSelectedOptions,
} from '../dropdownSelection';

describe('dropdownSelection', () => {
  describe('toSelectedOptions', () => {
    it('treats null, undefined, and empty string as no selection', () => {
      expect(toSelectedOptions(null)).toEqual([]);
      expect(toSelectedOptions(undefined)).toEqual([]);
      expect(toSelectedOptions('')).toEqual([]);
    });

    it('drops blank entries that clear/deselect paths leave behind', () => {
      expect(toSelectedOptions(['Music', '', '  ', 'Nursing'])).toEqual(['Music', 'Nursing']);
      expect(toSelectedOptions([''])).toEqual([]);
    });

    it('wraps a single non-empty value', () => {
      expect(toSelectedOptions('Sydney')).toEqual(['Sydney']);
    });
  });

  describe('nextSelectedValues', () => {
    it('replaces selection in single-select mode', () => {
      expect(nextSelectedValues(['a'], 'b', true, false)).toEqual(['b']);
      expect(nextSelectedValues(['a'], 'a', false, false)).toEqual([]);
    });

    it('adds and removes in multi-select mode', () => {
      expect(nextSelectedValues(['a'], 'b', true, true)).toEqual(['a', 'b']);
      expect(nextSelectedValues(['a', 'b'], 'a', false, true)).toEqual(['b']);
    });
  });

  describe('fieldValueFromSelection', () => {
    it('stores arrays for multiple and scalar/empty for single', () => {
      expect(fieldValueFromSelection(['a', 'b'], true)).toEqual(['a', 'b']);
      expect(fieldValueFromSelection(['a'], false)).toBe('a');
      expect(fieldValueFromSelection([], false)).toBe('');
    });
  });

  describe('canCreateOption', () => {
    const exists = (val: string | number) => String(val) === 'Music';
    const isSelected = (val: string | number) => String(val).toLowerCase() === 'nursing';

    it('rejects disabled, non-creatable, blank, existing, and selected values', () => {
      expect(
        canCreateOption({
          disabled: true,
          creatable: true,
          inputValue: 'Art',
          exists,
          isSelected,
        }),
      ).toBe(false);
      expect(
        canCreateOption({
          creatable: false,
          inputValue: 'Art',
          exists,
          isSelected,
        }),
      ).toBe(false);
      expect(
        canCreateOption({
          creatable: true,
          inputValue: '   ',
          exists,
          isSelected,
        }),
      ).toBe(false);
      expect(
        canCreateOption({
          creatable: true,
          inputValue: 'Music',
          exists,
          isSelected,
        }),
      ).toBe(false);
      expect(
        canCreateOption({
          creatable: true,
          inputValue: 'Nursing',
          exists,
          isSelected,
        }),
      ).toBe(false);
    });

    it('allows a novel trimmed value', () => {
      expect(
        canCreateOption({
          creatable: true,
          inputValue: '  Business  ',
          exists,
          isSelected,
        }),
      ).toBe(true);
    });
  });

  describe('filterSearchableOptions', () => {
    const options = [
      { label: 'Digital Skills', value: 'digital-skills' },
      { label: 'Nursing', value: 'nursing' },
    ];

    it('returns all options when not searchable', () => {
      expect(filterSearchableOptions(options, 'zzz', false)).toEqual(options);
    });

    it('filters by label substring case-insensitively', () => {
      expect(filterSearchableOptions(options, 'dig', true)).toEqual([options[0]]);
      expect(filterSearchableOptions(options, 'NOPE', true)).toEqual([]);
    });
  });

  describe('lookups and display value', () => {
    it('resolves labels and membership', () => {
      const { getLabel, exists } = buildOptionLookup([{ label: 'Music', value: 'music' }]);
      expect(getLabel('music')).toBe('Music');
      expect(getLabel('unknown')).toBe('unknown');
      expect(exists('music')).toBe(true);
      expect(exists('unknown')).toBe(false);
    });

    it('matches option existence case-insensitively', () => {
      const { getLabel, exists } = buildOptionLookup([{ label: 'Sydney', value: 'Sydney' }]);
      expect(exists('sydney')).toBe(true);
      expect(exists('SYDNEY')).toBe(true);
      expect(getLabel('sydney')).toBe('Sydney');
    });

    it('matches selected values case-insensitively', () => {
      const isSelected = buildSelectedLookup(['Music']);
      expect(isSelected('music')).toBe(true);
      expect(isSelected('Nursing')).toBe(false);
    });

    it('shows label for single-select selection instead of draft', () => {
      expect(resolveDisplayInputValue(false, ['music'], 'draft', () => 'Music')).toBe('Music');
      expect(resolveDisplayInputValue(true, ['music'], 'draft', () => 'Music')).toBe('draft');
      expect(resolveDisplayInputValue(false, [], 'draft', () => 'Music')).toBe('draft');
    });
  });
});
