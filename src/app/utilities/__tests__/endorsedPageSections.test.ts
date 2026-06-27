import {
  ENDORSED_INSTITUTION_TYPE,
  ENDORSED_PAGE_SECTION,
  resolveStatsSectionId,
} from '@/app/utilities/endorsedPageSections';

describe('endorsedPageSections', () => {
  it('resolveStatsSectionId returns key-data-points for VET', () => {
    expect(resolveStatsSectionId(ENDORSED_INSTITUTION_TYPE.VET)).toBe(
      ENDORSED_PAGE_SECTION.KEY_DATA_POINTS
    );
  });

  it('resolveStatsSectionId returns stats for non-VET', () => {
    expect(resolveStatsSectionId('Higher Education')).toBe(
      ENDORSED_PAGE_SECTION.STATS
    );
  });
});
