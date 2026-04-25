'use client';

import TabSection from '@/app/components/tabSection/TabSection';
import CourseDetailsBenefitsBody from '@/app/components/tabSection/CourseDetailsBenefitsBody';
import { COURSE_BENEFITS_TAB_SECTION } from '@/app/components/tabSection/courseBenefitsTabSectionData';

const { title, tabs, disclaimer } = COURSE_BENEFITS_TAB_SECTION;

const CourseDetailsBenefitTab: React.FC = () => {
  return (
    <TabSection
      title={title}
      tabs={tabs.map(({ id, label }) => ({ id, label }))}
      disclaimer={disclaimer ?? undefined}
    >
      {(activeTabId) => {
        const tab = tabs.find((t) => t.id === activeTabId);
        if (!tab) {
          return null;
        }
        return <CourseDetailsBenefitsBody source={tab.courseSource} />;
      }}
    </TabSection>
  );
};

export default CourseDetailsBenefitTab;
