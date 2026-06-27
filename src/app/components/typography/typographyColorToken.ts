/**
 * Design-token values for `Typography` `color` — each must have a class in
 * `typographyColorClasses.ts` and `typography.module.css`.
 *
 * Implemented as a const map so existing call sites can keep string literals
 * like `'var(--GhostWhite)'` while typed usage can reference `TypographyColorToken.GhostWhite`.
 */
export const TypographyColorToken = {
  PureWhite: 'var(--pure-white)',
  GhostWhite: 'var(--GhostWhite)',
  GhostWhiteVariant: 'var(--GhostWhiteVariant)',
  BondBlack: 'var(--BondBlack)',
  BondBlackVariant: 'var(--BondBlackVariant)',
  Grey: 'var(--grey)',
  Grey300: 'var(--grey-300)',
  Grey500: 'var(--grey-500)',
  CherryPie: 'var(--cherryPie)',
  CherryPieVariant: 'var(--cherryPieVariant)',
} as const;

export type TypographyDesignToken =
  (typeof TypographyColorToken)[keyof typeof TypographyColorToken];

/** Supported `Typography` colors: design tokens plus the legacy error keyword. */
export type TypographyColor = TypographyDesignToken | 'red';
