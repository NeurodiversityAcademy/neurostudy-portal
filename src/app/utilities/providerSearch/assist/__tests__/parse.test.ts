import { detectInText, tryKeywordHit } from '../parse';

describe('provider assist parsing', () => {
  const catalog = {
    interestAreaCatalog: ['Nursing', 'Creative Industries', 'Design', 'Screen Media', 'Screen/Media/Games'],
    locationCatalog: ['Melbourne', 'VIC', 'Sydney', 'NSW'],
  };

  it('matches fuzzy area aliases like creative and media', () => {
    expect(detectInText('creative', catalog.interestAreaCatalog)).toContain('Creative Industries');
    expect(detectInText('media', catalog.interestAreaCatalog)).toContain('Screen Media');
  });

  it('resolves a natural-language query to a single canonical area and location', () => {
    expect(
      tryKeywordHit('creative in melbourne', {
        searchDemo: false,
        providers: [],
        interestAreaCatalog: catalog.interestAreaCatalog,
        locationCatalog: catalog.locationCatalog,
      }),
    ).toEqual({
      area: 'Creative Industries',
      locations: ['Melbourne', 'VIC'],
    });
  });
});
