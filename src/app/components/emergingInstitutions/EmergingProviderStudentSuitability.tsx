'use client';

import TabSection from '@/app/components/tabSection/TabSection';
import TabSectionStringList from '@/app/components/tabSection/TabSectionStringList';
import { getStudentSuitabilitySection } from '@/app/components/tabSection/emergingInstituteTabSectionsData';
import styles from './emergingInstitutions.module.css';

export interface EmergingProviderStudentSuitabilityProps {
  instituteSlug: string;
}

export default function EmergingProviderStudentSuitability({
  instituteSlug,
}: EmergingProviderStudentSuitabilityProps) {
  const config = getStudentSuitabilitySection(instituteSlug);

  return (
    <TabSection
      sectionClassName={styles.providerBenefitsSection}
      title={config.title}
      titleColor='var(--GhostWhiteVariant)'
      tabs={config.tabs.map(({ id, label }) => ({ id, label }))}
      disclaimer={config.disclaimer ?? undefined}
    >
      {(activeTabId) => {
        const tab = config.tabs.find((t) => t.id === activeTabId);
        if (!tab) {
          return null;
        }
        return (
          <TabSectionStringList
            items={tab.items}
            iconType={tab.iconType}
            listClassName={styles.providerBenefitsList}
            itemClassName={styles.providerBenefitsItem}
            positiveIconClassName={styles.providerBenefitsPositiveIcon}
          />
        );
      }}
    </TabSection>
  );
}
