import type { StaticImageData } from 'next/image';

/** Intrinsic size for public fallback `/images/AcademiaLogoLong.png`. */
export const ENDORSED_FALLBACK_LOGO_WIDTH = 921;
export const ENDORSED_FALLBACK_LOGO_HEIGHT = 271;
export const ENDORSED_FALLBACK_LOGO_SRC = '/images/AcademiaLogoLong.png';

export function getEndorsedLogoDimensions(
  logoSrc: string | StaticImageData,
): { width: number; height: number } {
  if (typeof logoSrc === 'string') {
    return { width: ENDORSED_FALLBACK_LOGO_WIDTH, height: ENDORSED_FALLBACK_LOGO_HEIGHT };
  }
  return { width: logoSrc.width, height: logoSrc.height };
}
