import { EMERGING_PAGE_SECTION } from '@/app/utilities/emergingPageSections';

describe('emergingPageSections', () => {
  it('defines stable section ids for emerging provider detail pages', () => {
    expect(EMERGING_PAGE_SECTION.HERO).toBe('hero');
    expect(EMERGING_PAGE_SECTION.SUITABILITY).toBe('suitability');
    expect(EMERGING_PAGE_SECTION.STATS).toBe('stats');
    expect(EMERGING_PAGE_SECTION.FAQS).toBe('faqs');
  });
});
