import { buildEmergingProviderDetailHref } from '@/app/emergingproviders/emergingProviderMetadata';
import { slugify } from '@/app/utilities/common';
import { hasEmergingProviderProfile } from './emergingProviderProfileSlugs';

/** Shared emerging CTA destination — used by the card and search GA. */
export function resolveEmergingProviderHref(params: {
  name: string;
  demo?: boolean;
}): string | undefined {
  const providerSlug = slugify(params.name);
  if (params.demo || !hasEmergingProviderProfile(providerSlug)) {
    return undefined;
  }
  return buildEmergingProviderDetailHref(providerSlug);
}
