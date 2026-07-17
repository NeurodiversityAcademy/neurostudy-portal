import {
  normalizeTypographyColorToken,
  typographyColorClassForToken,
  TYPOGRAPHY_COLOR_CLASS_BY_TOKEN,
} from '../typographyColorClasses';

describe('normalizeTypographyColorToken', () => {
  it('trims whitespace after var( and before )', () => {
    expect(normalizeTypographyColorToken('var( --GhostWhite)')).toBe(
      'var(--GhostWhite)',
    );
    expect(normalizeTypographyColorToken('var(--BondBlack )')).toBe(
      'var(--BondBlack)',
    );
    expect(normalizeTypographyColorToken('var( --grey )')).toBe(
      'var(--grey)',
    );
  });

  it('returns the same string when already clean', () => {
    expect(normalizeTypographyColorToken('var(--GhostWhite)')).toBe(
      'var(--GhostWhite)',
    );
  });

  it('trims leading/trailing whitespace', () => {
    expect(normalizeTypographyColorToken(' red ')).toBe('red');
  });
});

describe('typographyColorClassForToken', () => {
  it('returns undefined for undefined or empty input', () => {
    expect(typographyColorClassForToken(undefined)).toBeUndefined();
    expect(typographyColorClassForToken('')).toBeUndefined();
  });

  it('returns a class for a known token', () => {
    const cls = typographyColorClassForToken('var(--GhostWhite)');
    expect(cls).toBe(TYPOGRAPHY_COLOR_CLASS_BY_TOKEN['var(--GhostWhite)']);
  });

  it('normalizes before lookup', () => {
    const cls = typographyColorClassForToken('var( --GhostWhite)');
    expect(cls).toBe(TYPOGRAPHY_COLOR_CLASS_BY_TOKEN['var(--GhostWhite)']);
  });

  it('returns undefined for unknown tokens', () => {
    expect(typographyColorClassForToken('var(--doesNotExist)')).toBeUndefined();
  });

  it('returns a class for the red token', () => {
    expect(typographyColorClassForToken('red')).toBe(
      TYPOGRAPHY_COLOR_CLASS_BY_TOKEN['red'],
    );
  });
});
