export const PROVIDER_SEARCH_PATH = '/search' as const;

export const PROVIDER_SEARCH_QUERY = {
  INTEREST_AREA: 'InterestArea',
  LOCATION: 'Location',
  SEARCH_DEMO: 'searchDemo',
} as const;

export const PROVIDER_SEARCH_DEMO_PARAM_VALUE = '1' as const;

/** Fixture slug used when `?searchDemo=1` unlocks course-endorsed preview. */
export const PROVIDER_SEARCH_DEMO_COURSE_ENDORSED_SLUG = 'collarts' as const;

export const PROVIDER_SEARCH_DEMO_PROMOTED_COURSE = {
  id: 'search-demo-course',
  title: 'Demo promoted course',
  interestAreas: ['Music'],
} as const;

export type ProviderSearchTier = 'course_endorsed' | 'starred_endorsed' | 'endorsed' | 'emerging';

export const PROVIDER_SEARCH_TIER_ORDER: readonly ProviderSearchTier[] = [
  'course_endorsed',
  'starred_endorsed',
  'endorsed',
  'emerging',
] as const;

export const PROVIDER_SEARCH_TIER_HEADING: Record<ProviderSearchTier, string> = {
  course_endorsed: 'Courses from endorsed providers',
  starred_endorsed: 'NDA Certified providers',
  endorsed: 'Endorsed providers',
  emerging: 'Emerging providers',
};

export const PROVIDER_SEARCH_GA_CATEGORY = 'ProviderSearch' as const;

export const PROVIDER_SEARCH_GA = {
  submit: {
    eventName: 'provider_search_submit',
    category: PROVIDER_SEARCH_GA_CATEGORY,
  },
  resultsView: {
    eventName: 'provider_search_results_view',
    category: PROVIDER_SEARCH_GA_CATEGORY,
  },
  resultClick: {
    eventName: 'provider_search_result_click',
    category: PROVIDER_SEARCH_GA_CATEGORY,
  },
  coursesPlaceholderView: {
    eventName: 'provider_courses_placeholder_view',
    category: PROVIDER_SEARCH_GA_CATEGORY,
  },
} as const;

export type ProviderSearchSurface = 'homepage' | 'search_page';

export type ProviderSearchKind = 'endorsed' | 'emerging';

export type ProviderSearchRecord = {
  kind: ProviderSearchKind;
  slug: string;
  name: string;
  interestAreas: string[];
  locations: string[];
  ndaCertified: boolean;
  hasPromotedCourses: boolean;
  logoSrc?: string;
  topBackgroundImage?: string;
  emergingState?: string;
};

export type ProviderSearchFilters = {
  interestAreas: string[];
  locations: string[];
};

export type ProviderSearchTierResults = Record<ProviderSearchTier, ProviderSearchRecord[]>;

export type ProviderStudySearchFormValues = {
  InterestArea: string[];
  Location: string[];
};
