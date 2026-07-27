import type { Metadata } from 'next';
import EmergingProvidersDirectory from '@/app/components/emergingInstitutions/EmergingProvidersDirectory';
import HomeBanner from '@/app/components/bannerStudents/HomeBanner';
import { HOST_URL, SITE_NAME } from '@/app/utilities/constants';
import { EMERGING_PROVIDERS_DIRECTORY_PATH } from '@/app/components/emergingInstitutions/emergingProvidersPaths';
import { buildEmergingProvidersDirectoryKeywords } from '@/app/emergingproviders/emergingProviderMetadata';
import emergingInstitutions from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import { countDistinctStates } from '@/app/components/emergingInstitutions/emergingInstitutionTypes';
import type { EmergingInstitution } from '@/app/components/emergingInstitutions/emergingInstitutionTypes';

const TITLE = 'NDA Emerging Providers';
const DESCRIPTION =
  'Browse every NDA Emerging Provider — organisations with developing practices and strong potential for neuro-inclusive education.';

const INSTITUTIONS = emergingInstitutions as EmergingInstitution[];
const PROVIDER_COUNT = INSTITUTIONS.length;
const STATE_COUNT = countDistinctStates(INSTITUTIONS);
const BANNER_SUBTITLE = `${PROVIDER_COUNT} providers across ${STATE_COUNT} states & territories — organisations with developing practices and strong potential for neuro-inclusive education.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: buildEmergingProvidersDirectoryKeywords(),
  alternates: {
    canonical: `${HOST_URL}${EMERGING_PROVIDERS_DIRECTORY_PATH}`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${HOST_URL}${EMERGING_PROVIDERS_DIRECTORY_PATH}`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function EmergingProvidersIndexPage() {
  return (
    <main>
      <HomeBanner
        displayBadges={false}
        displayFilter={false}
        compactCover
        title={TITLE}
        subtitle={BANNER_SUBTITLE}
      />
      <EmergingProvidersDirectory />
    </main>
  );
}
