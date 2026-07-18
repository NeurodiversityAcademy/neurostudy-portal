export const EMERGING_PAGE_SECTION = {
  HERO: 'hero',
  SUITABILITY: 'suitability',
  STATS: 'stats',
  FAQS: 'faqs',
} as const;

export type EmergingPageSectionId =
  (typeof EMERGING_PAGE_SECTION)[keyof typeof EMERGING_PAGE_SECTION];
