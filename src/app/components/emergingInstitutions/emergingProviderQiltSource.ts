import institutions from './emergingInstitutions.json';
import { slugify } from '@/app/utilities/common';

const COMPARED_EDU_INSTITUTION_BASE = 'https://www.compared.edu.au/institution';

export const QILT_SURVEY_2024_LABEL = 'QILT survey 2024';

const PARENTHETICAL_ACRONYM_PATTERN = /\(([A-Za-z]{2,5})\)\s*$/;

/** Trailing parenthetical acronym e.g. "(ACU)" → "acu". */
export function extractParentheticalAcronym(name: string): string | undefined {
  const match = name.match(PARENTHETICAL_ACRONYM_PATTERN);
  return match?.[1]?.toLowerCase();
}

/**
 * Strip a trailing `-xyz` slug segment when the institute name ends with `(XYZ)`
 * and the segment matches that acronym (2–5 letters).
 */
export function stripTrailingAcronymFromSlug(ndaSlug: string, name: string): string {
  const acronym = extractParentheticalAcronym(name);
  if (!acronym) {
    return ndaSlug;
  }

  const suffix = `-${acronym}`;
  if (ndaSlug.endsWith(suffix) && ndaSlug.length > suffix.length) {
    return ndaSlug.slice(0, -suffix.length);
  }

  return ndaSlug;
}

function buildNdaToComparedEduSlugMap(): Record<string, string> {
  const map: Record<string, string> = {};

  for (const { name } of institutions) {
    const ndaSlug = slugify(name);
    const comparedSlug = stripTrailingAcronymFromSlug(ndaSlug, name);

    if (comparedSlug !== ndaSlug) {
      map[ndaSlug] = comparedSlug;
    }
  }

  return map;
}

/** NDA emerging-provider slug → Compared.edu institution path slug (entries differ only). */
export const NDA_TO_COMPARED_EDU_SLUG: Readonly<Record<string, string>> =
  buildNdaToComparedEduSlugMap();

export function resolveComparedEduSlug(ndaSlug: string): string {
  return NDA_TO_COMPARED_EDU_SLUG[ndaSlug] ?? ndaSlug;
}

/** Per-institute Compared.edu undergraduate QILT page. */
export function buildComparedEduUndergraduateHref(ndaSlug: string): string {
  const comparedSlug = resolveComparedEduSlug(ndaSlug);
  return `${COMPARED_EDU_INSTITUTION_BASE}/${comparedSlug}/undergraduate`;
}
