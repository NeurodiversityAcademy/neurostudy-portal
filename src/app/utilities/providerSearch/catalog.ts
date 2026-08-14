import emergingInstitutions from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import type { EmergingInstitution } from '@/app/components/emergingInstitutions/emergingInstitutionTypes';
import {
  getEndorsedDisplayNameForSlug,
  getEndorsedJsonRows,
  getStudyAreasForSlug,
  type EndorsedJsonRow,
  type EndorsedPromotedCourse,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import { slugify } from '@/app/utilities/common';
import {
  PROVIDER_SEARCH_DEMO_COURSE_ENDORSED_SLUG,
  PROVIDER_SEARCH_DEMO_PROMOTED_COURSE,
  type ProviderSearchRecord,
} from './constants';
import { EMERGING_INTEREST_AREAS_BY_SLUG } from './emergingInterestAreas';
import { uniqueSortedStrings } from './normalize';

function endorsedDisplayName(row: EndorsedJsonRow): string {
  return getEndorsedDisplayNameForSlug(slugify(row.id)) ?? row.id;
}

function optionalTrimmed(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed;
}

function resolveEndorsedInterestAreas(
  row: EndorsedJsonRow,
  promotedCourses: EndorsedPromotedCourse[],
): string[] {
  const slug = slugify(row.id);
  const profileAreas = getStudyAreasForSlug(slug);
  const taggedAreas = row.interestAreas ?? [];
  const promotedAreas = promotedCourses.flatMap((course) => course.interestAreas);
  return uniqueSortedStrings([...profileAreas, ...taggedAreas, ...promotedAreas]);
}

function buildEndorsedRecord(
  row: EndorsedJsonRow,
  promotedCourses: EndorsedPromotedCourse[],
): ProviderSearchRecord {
  const slug = slugify(row.id);
  return {
    kind: 'endorsed',
    slug,
    name: endorsedDisplayName(row),
    interestAreas: resolveEndorsedInterestAreas(row, promotedCourses),
    locations: row.locations ?? [],
    ndaCertified: row.ndaCertified === true,
    hasPromotedCourses: promotedCourses.length > 0,
    logoSrc: optionalTrimmed(row.logo),
    topBackgroundImage: optionalTrimmed(row.topBackgroundImage),
  };
}

function buildEmergingRecord(institution: EmergingInstitution): ProviderSearchRecord {
  const slug = slugify(institution.name);
  const locations = uniqueSortedStrings([institution.state, ...(institution.locations ?? [])]);
  return {
    kind: 'emerging',
    slug,
    name: institution.name,
    interestAreas: uniqueSortedStrings([
      ...(EMERGING_INTEREST_AREAS_BY_SLUG[slug] ?? []),
      ...(institution.interestAreas ?? []),
    ]),
    locations,
    ndaCertified: false,
    hasPromotedCourses: false,
    emergingState: institution.state,
  };
}

function withDemoPromotedCourses(row: EndorsedJsonRow): EndorsedPromotedCourse[] {
  const existing = row.promotedCourses ?? [];
  const hasDemo = existing.some((course) => course.id === PROVIDER_SEARCH_DEMO_PROMOTED_COURSE.id);
  if (hasDemo) {
    return existing;
  }
  return [
    ...existing,
    {
      id: PROVIDER_SEARCH_DEMO_PROMOTED_COURSE.id,
      title: PROVIDER_SEARCH_DEMO_PROMOTED_COURSE.title,
      interestAreas: [...PROVIDER_SEARCH_DEMO_PROMOTED_COURSE.interestAreas],
    },
  ];
}

function promotedCoursesForRow(
  row: EndorsedJsonRow,
  searchDemo: boolean,
): EndorsedPromotedCourse[] {
  const existing = row.promotedCourses ?? [];
  const isDemoTarget = slugify(row.id) === PROVIDER_SEARCH_DEMO_COURSE_ENDORSED_SLUG;
  if (!searchDemo) {
    return existing;
  }
  if (!isDemoTarget) {
    return existing;
  }
  return withDemoPromotedCourses(row);
}

function toEndorsedSearchRecord(row: EndorsedJsonRow, searchDemo: boolean): ProviderSearchRecord {
  return buildEndorsedRecord(row, promotedCoursesForRow(row, searchDemo));
}

export type ProviderSearchContext = {
  searchDemo: boolean;
  providers: ProviderSearchRecord[];
  interestAreaCatalog: string[];
  locationCatalog: string[];
};

export function listSearchableProviders(options?: {
  searchDemo?: boolean;
}): ProviderSearchRecord[] {
  const searchDemo = options?.searchDemo === true;
  const endorsed = getEndorsedJsonRows()
    .filter((row) => row.live === true)
    .map((row) => toEndorsedSearchRecord(row, searchDemo));
  const emerging = (emergingInstitutions as EmergingInstitution[]).map(buildEmergingRecord);
  return [...endorsed, ...emerging];
}

/** One catalog pass shared by pages and filter resolution. */
export function loadProviderSearchContext(options?: {
  searchDemo?: boolean;
}): ProviderSearchContext {
  const searchDemo = options?.searchDemo === true;
  const providers = listSearchableProviders({ searchDemo });
  return {
    searchDemo,
    providers,
    interestAreaCatalog: uniqueSortedStrings(
      providers.flatMap((provider) => provider.interestAreas),
    ),
    locationCatalog: uniqueSortedStrings(providers.flatMap((provider) => provider.locations)),
  };
}

export function getProviderSearchInterestAreaCatalog(options?: { searchDemo?: boolean }): string[] {
  return loadProviderSearchContext(options).interestAreaCatalog;
}

export function getProviderSearchLocationCatalog(options?: { searchDemo?: boolean }): string[] {
  return loadProviderSearchContext(options).locationCatalog;
}

export function toDropdownOptions(values: readonly string[]): { label: string; value: string }[] {
  return values.map((value) => ({ label: value, value }));
}
