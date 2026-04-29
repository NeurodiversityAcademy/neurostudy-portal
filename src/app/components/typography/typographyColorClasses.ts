import styles from './typography.module.css';

/** Normalizes legacy strings like `var( --GhostWhite)` to `var(--GhostWhite)`. */
export function normalizeTypographyColorToken(value: string): string {
  return value
    .replace(/var\(\s+/g, 'var(')
    .replace(/\s+\)/g, ')')
    .trim();
}

/**
 * Maps `Typography` `color` prop values to CSS module classes.
 * Add an entry here and a matching rule in typography.module.css for any new token.
 */
export const TYPOGRAPHY_COLOR_CLASS_BY_TOKEN: Record<string, string> = {
  'var(--pure-white)': styles.colorPureWhite,
  'var(--GhostWhite)': styles.colorGhostWhite,
  'var(--GhostWhiteVariant)': styles.colorGhostWhiteVariant,
  'var(--BondBlack)': styles.colorBondBlack,
  'var(--BondBlackVariant)': styles.colorBondBlackVariant,
  'var(--grey)': styles.colorGrey,
  'var(--grey-300)': styles.colorGrey300,
  'var(--grey-500)': styles.colorGrey500,
  'var(--cherryPie)': styles.colorCherryPie,
  'var(--cherryPieVariant)': styles.colorCherryPieVariant,
  red: styles.colorError,
};

export function typographyColorClassForToken(
  color: string | undefined
): string | undefined {
  if (!color) {
    return undefined;
  }
  const normalized = normalizeTypographyColorToken(color);
  return TYPOGRAPHY_COLOR_CLASS_BY_TOKEN[normalized];
}
