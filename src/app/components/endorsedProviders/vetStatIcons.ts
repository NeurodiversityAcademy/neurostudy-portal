import type { StaticImageData } from 'next/image';

import completionRatesIcon from '@/app/images/emergingInstitutions/completion-rates-icon.png';
import neurodivergentIcon from '@/app/images/emergingInstitutions/neurodivergent-icon.png';
import remoteRegionalIcon from '@/app/images/emergingInstitutions/remote-regional-icon.png';
import reportDisabilityIcon from '@/app/images/emergingInstitutions/report-disability-icon.png';
import studentStatIcon from '@/app/images/emergingInstitutions/student-stat-icon.png';
import vetGraduateIcon from '@/app/images/emergingInstitutions/vet-graduate-icon.png';

export const VET_KEY_DATA_POINT_ICONS = {
  disabilityPrevalence: reportDisabilityIcon,
  disabilityYoungStudents: studentStatIcon,
  remoteRegional: remoteRegionalIcon,
  completionRates: completionRatesIcon,
  graduateEmployment: vetGraduateIcon,
  neurodivergentPrevalence: neurodivergentIcon,
} as const satisfies Record<string, StaticImageData>;

export type VetKeyDataPointIconKey = keyof typeof VET_KEY_DATA_POINT_ICONS;
