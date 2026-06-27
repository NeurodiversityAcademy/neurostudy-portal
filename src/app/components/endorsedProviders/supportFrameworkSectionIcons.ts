import type { StaticImageData } from 'next/image';

import assessmentIcon from '@/app/images/emergingInstitutions/assessment-icon.png';
import assistiveTechnologyIcon from '@/app/images/emergingInstitutions/assistive-technology-icon.png';
import campusIcon from '@/app/images/emergingInstitutions/campus-icon.png';
import learningDesignDeliveryIcon from '@/app/images/emergingInstitutions/learning-design-delivery-icon.png';
import policyComplianceIcon from '@/app/images/emergingInstitutions/policy-compliance-icon.png';
import preEnrolmentDisclosureIcon from '@/app/images/emergingInstitutions/pre-enrolment-disclosure-icon.png';
import staffTrainingIcon from '@/app/images/emergingInstitutions/staff-training-icon.png';
import supportServicesIcon from '@/app/images/emergingInstitutions/support-services-icon.png';
import supportStaffIcon from '@/app/images/emergingInstitutions/support-staff-icon.png';
import websiteDigitalAccessibilityIcon from '@/app/images/emergingInstitutions/website-digital-accessibility-icon.png';

const SUPPORT_FRAMEWORK_SECTION_ICONS: Record<string, StaticImageData> = {
  'Staff Training': staffTrainingIcon,
  'Support Staff': supportStaffIcon,
  'Pre-Enrolment & Disclosure': preEnrolmentDisclosureIcon,
  'Student Support': supportServicesIcon,
  'Website & Digital Accessibility': websiteDigitalAccessibilityIcon,
  'Assistive Technology': assistiveTechnologyIcon,
  Assessment: assessmentIcon,
  'Learning Design & Delivery': learningDesignDeliveryIcon,
  Campus: campusIcon,
  'Policy & Compliance': policyComplianceIcon,
};

export function getSupportFrameworkSectionIcon(
  sectionTitle: string
): StaticImageData | undefined {
  return SUPPORT_FRAMEWORK_SECTION_ICONS[sectionTitle];
}
