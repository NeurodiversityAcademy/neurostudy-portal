export const ENDORSED_PAGE_SECTION = {
  INTRO: 'intro',
  STUDY_AREAS: 'study-areas',
  KEY_DATA_POINTS: 'key-data-points',
  STATS: 'stats',
  ENHANCEMENTS: 'enhancements',
  FAQS: 'faqs',
} as const;

export type EndorsedPageSectionId =
  (typeof ENDORSED_PAGE_SECTION)[keyof typeof ENDORSED_PAGE_SECTION];

export const ENDORSED_INSTITUTION_TYPE = {
  VET: 'VET',
} as const;

export function resolveStatsSectionId(institutionType: string): EndorsedPageSectionId {
  if (institutionType === ENDORSED_INSTITUTION_TYPE.VET) {
    return ENDORSED_PAGE_SECTION.KEY_DATA_POINTS;
  }
  return ENDORSED_PAGE_SECTION.STATS;
}
