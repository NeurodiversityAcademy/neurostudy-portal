import institutions from '../emergingInstitutions.json';
import {
  NDA_TO_COMPARED_EDU_SLUG,
  QILT_2024_NATIONAL_REPORT_URL,
  QILT_2025_NATIONAL_REPORT_URL,
  QILT_SES_URL,
  QILT_SURVEY_2024_LABEL,
  UOW_2025_SES_MEDIA_RELEASE_URL,
  buildComparedEduUndergraduateHref,
  extractParentheticalAcronym,
  resolveComparedEduSlug,
  stripTrailingAcronymFromSlug,
} from '../emergingProviderQiltSource';
import { slugify } from '@/app/utilities/common';

describe('emergingProviderQiltSource', () => {
  it('uses the QILT survey 2024 label', () => {
    expect(QILT_SURVEY_2024_LABEL).toBe('QILT survey 2024');
  });

  it('exposes the QILT and UOW source URLs', () => {
    expect(QILT_SES_URL).toBe('https://www.qilt.edu.au/surveys/student-experience-survey-(ses)');
    expect(QILT_2024_NATIONAL_REPORT_URL).toContain('2024-ses-national-report.pdf');
    expect(QILT_2025_NATIONAL_REPORT_URL).toContain('2025-ses-national-report.pdf');
    expect(UOW_2025_SES_MEDIA_RELEASE_URL).toContain('uow.edu.au/media/2026');
  });

  it('extracts a trailing parenthetical acronym from an institute name', () => {
    expect(extractParentheticalAcronym('Australian Catholic University (ACU)')).toBe('acu');
    expect(extractParentheticalAcronym("King's Own Institute (KOI)")).toBe('koi');
    expect(extractParentheticalAcronym('Bond University')).toBeUndefined();
  });

  it('strips a trailing acronym slug segment only when the name contains that acronym', () => {
    expect(
      stripTrailingAcronymFromSlug(
        'australian-catholic-university-acu',
        'Australian Catholic University (ACU)',
      ),
    ).toBe('australian-catholic-university');
    expect(stripTrailingAcronymFromSlug('bond-university', 'Bond University')).toBe(
      'bond-university',
    );
    expect(
      stripTrailingAcronymFromSlug('kings-own-institute-koi', "King's Own Institute (KOI)"),
    ).toBe('kings-own-institute');
  });

  it('maps NDA slugs to Compared.edu slugs only where they differ', () => {
    for (const { name } of institutions) {
      const ndaSlug = slugify(name);
      const expectedComparedSlug = stripTrailingAcronymFromSlug(ndaSlug, name);

      if (expectedComparedSlug === ndaSlug) {
        expect(NDA_TO_COMPARED_EDU_SLUG[ndaSlug]).toBeUndefined();
      } else {
        expect(NDA_TO_COMPARED_EDU_SLUG[ndaSlug]).toBe(expectedComparedSlug);
      }

      expect(resolveComparedEduSlug(ndaSlug)).toBe(expectedComparedSlug);
    }
  });

  it('builds a per-slug Compared.edu undergraduate href', () => {
    expect(buildComparedEduUndergraduateHref('bond-university')).toBe(
      'https://www.compared.edu.au/institution/bond-university/undergraduate',
    );
    expect(buildComparedEduUndergraduateHref('deakin-university')).toBe(
      'https://www.compared.edu.au/institution/deakin-university/undergraduate',
    );
    expect(buildComparedEduUndergraduateHref('australian-catholic-university-acu')).toBe(
      'https://www.compared.edu.au/institution/australian-catholic-university/undergraduate',
    );
    expect(buildComparedEduUndergraduateHref('kings-own-institute-koi')).toBe(
      'https://www.compared.edu.au/institution/kings-own-institute/undergraduate',
    );
  });
});
