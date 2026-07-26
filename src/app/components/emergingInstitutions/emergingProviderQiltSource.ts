const COMPARED_EDU_INSTITUTION_BASE = 'https://www.compared.edu.au/institution';

export const QILT_SURVEY_2024_LABEL = 'QILT survey 2024';

/** Per-institute Compared.edu undergraduate QILT page; slug matches emerging provider slugs. */
export function buildComparedEduUndergraduateHref(slug: string): string {
  return `${COMPARED_EDU_INSTITUTION_BASE}/${slug}/undergraduate`;
}
