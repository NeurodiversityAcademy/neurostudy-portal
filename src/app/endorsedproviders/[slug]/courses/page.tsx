import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProviderCoursesPlaceholder from '@/app/components/providerSearch/ProviderCoursesPlaceholder';
import {
  getEndorsedDisplayNameForSlug,
  hasPromotedCoursesForSlug,
  isKnownEndorsedSlug,
  isLiveEndorsedSlug,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import type { SearchParams } from '@/app/utilities/featureToggle';
import { EMPTY_SEARCH_PARAMS } from '@/app/utilities/searchParamsReader';
import { isProviderSearchDemoEnabled } from '@/app/utilities/providerSearch/buildSearchHref';
import {
  PROVIDER_SEARCH_DEMO_COURSE_ENDORSED_SLUG,
  PROVIDER_SEARCH_QUERY,
} from '@/app/utilities/providerSearch/constants';
import { HOST_URL } from '@/app/utilities/constants';

type RouteParams = {
  slug: string;
};

interface PageProps {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}

function canAccessCoursesPage(slug: string, searchDemo: boolean): boolean {
  if (!isKnownEndorsedSlug(slug) || !isLiveEndorsedSlug(slug)) {
    return false;
  }
  if (hasPromotedCoursesForSlug(slug)) {
    return true;
  }
  return searchDemo && slug === PROVIDER_SEARCH_DEMO_COURSE_ENDORSED_SLUG;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? EMPTY_SEARCH_PARAMS;
  const searchDemo = isProviderSearchDemoEnabled(
    resolvedSearchParams[PROVIDER_SEARCH_QUERY.SEARCH_DEMO],
  );
  const slug = resolvedParams.slug;

  if (!canAccessCoursesPage(slug, searchDemo)) {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }

  const displayName = getEndorsedDisplayNameForSlug(slug) ?? slug;
  return {
    title: `Courses | ${displayName}`,
    description: `Courses from ${displayName} are coming soon.`,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${HOST_URL}/endorsedproviders/${slug}/courses`,
    },
  };
}

export function generateStaticParams(): RouteParams[] {
  return [];
}

export default async function EndorsedProviderCoursesPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? EMPTY_SEARCH_PARAMS;
  const searchDemo = isProviderSearchDemoEnabled(
    resolvedSearchParams[PROVIDER_SEARCH_QUERY.SEARCH_DEMO],
  );
  const slug = resolvedParams.slug;

  if (!canAccessCoursesPage(slug, searchDemo)) {
    notFound();
  }

  const displayName = getEndorsedDisplayNameForSlug(slug) ?? slug;

  return <ProviderCoursesPlaceholder providerSlug={slug} providerName={displayName} />;
}
