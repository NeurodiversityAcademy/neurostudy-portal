import {
  QILT_SURVEY_2024_LABEL,
  buildComparedEduUndergraduateHref,
} from '../emergingProviderQiltSource';

describe('emergingProviderQiltSource', () => {
  it('uses the QILT survey 2024 label', () => {
    expect(QILT_SURVEY_2024_LABEL).toBe('QILT survey 2024');
  });

  it('builds a per-slug Compared.edu undergraduate href', () => {
    expect(buildComparedEduUndergraduateHref('bond-university')).toBe(
      'https://www.compared.edu.au/institution/bond-university/undergraduate',
    );
    expect(buildComparedEduUndergraduateHref('deakin-university')).toBe(
      'https://www.compared.edu.au/institution/deakin-university/undergraduate',
    );
  });
});
