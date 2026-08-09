import emergingInstitutions from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import type { EmergingInstitution } from '@/app/components/emergingInstitutions/emergingInstitutionTypes';
import {
  getEndorsedDisplayNameForSlug,
  getEndorsedJsonRows,
  type EndorsedJsonRow,
  type EndorsedPromotedCourse,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import { slugify } from '@/app/utilities/common';
import {
  PROVIDER_SEARCH_DEMO_COURSE_ENDORSED_SLUG,
  PROVIDER_SEARCH_DEMO_PROMOTED_COURSE,
  type ProviderSearchRecord,
} from './constants';
import { uniqueSortedStrings } from './normalize';

function endorsedDisplayName(row: EndorsedJsonRow): string {
  return getEndorsedDisplayNameForSlug(slugify(row.id)) ?? row.id;
}

function buildEndorsedRecord(
  row: EndorsedJsonRow,
  promotedCoursesOverride?: EndorsedPromotedCourse[],
): ProviderSearchRecord {
  const slug = slugify(row.id);
  const promotedCourses = promotedCoursesOverride ?? row.promotedCourses ?? [];
  return {
    kind: 'endorsed',
    slug,
    name: endorsedDisplayName(row),
    interestAreas: row.interestAreas ?? [],
    locations: row.locations ?? [],
    ndaCertified: row.ndaCertified === true,
    hasPromotedCourses: promotedCourses.length > 0,
    logoSrc: row.logo?.trim() || undefined,
    topBackgroundImage: row.topBackgroundImage?.trim() || undefined,
  };
}

function buildEmergingRecord(institution: EmergingInstitution): ProviderSearchRecord {
  const locations = uniqueSortedStrings([institution.state, ...(institution.locations ?? [])]);
  return {
    kind: 'emerging',
    slug: slugify(institution.name),
    name: institution.name,
    interestAreas: institution.interestAreas ?? [],
    locations,
    ndaCertified: false,
    hasPromotedCourses: false,
    emergingState: institution.state,
  };
}

export function listSearchableProviders(options?: {
  searchDemo?: boolean;
}): ProviderSearchRecord[] {
  const searchDemo = options?.searchDemo === true;
  const endorsedRows = getEndorsedJsonRows().filter((row) => row.live === true);
  const endorsed = endorsedRows.map((row) => {
    if (searchDemo && slugify(row.id) === PROVIDER_SEARCH_DEMO_COURSE_ENDORSED_SLUG) {
      const existing = row.promotedCourses ?? [];
      const hasDemo = existing.some(
        (course) => course.id === PROVIDER_SEARCH_DEMO_PROMOTED_COURSE.id,
      );
      const promotedCourses = hasDemo
        ? existing
        : [
            ...existing,
            {
              id: PROVIDER_SEARCH_DEMO_PROMOTED_COURSE.id,
              title: PROVIDER_SEARCH_DEMO_PROMOTED_COURSE.title,
              interestAreas: [...PROVIDER_SEARCH_DEMO_PROMOTED_COURSE.interestAreas],
            },
          ];
      return buildEndorsedRecord(row, promotedCourses);
    }
    return buildEndorsedRecord(row);
  });

  const emerging = (emergingInstitutions as EmergingInstitution[]).map(buildEmergingRecord);
  return [...endorsed, ...emerging];
}

export function getProviderSearchInterestAreaCatalog(options?: {
  searchDemo?: boolean;
}): string[] {
  return uniqueSortedStrings(
    listSearchableProviders(options).flatMap((provider) => provider.interestAreas),
  );
}

export function getProviderSearchLocationCatalog(options?: { searchDemo?: boolean }): string[] {
  return uniqueSortedStrings(
    listSearchableProviders(options).flatMap((provider) => provider.locations),
  );
}

export function toDropdownOptions(values: readonly string[]): { label: string; value: string }[] {
  return values.map((value) => ({ label: value, value }));
}
