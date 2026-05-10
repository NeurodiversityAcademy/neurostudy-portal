import Image, { type StaticImageData } from 'next/image';

import adjustmentsIcon from '@/app/images/emergingInstitutions/adjustments-icon.png';
import clearInformationIcon from '@/app/images/emergingInstitutions/clear-information-icon.png';
import commClearIcon from '@/app/images/emergingInstitutions/comm-clear-icon.png';
import overallExperienceIcon from '@/app/images/emergingInstitutions/overall-experience.png';

import type { TopStrengthIconKind } from './endorsedProviderPageData';
import styles from './topStrengthAreaIcon.module.css';

interface TopStrengthAreaIconProps {
  kind: TopStrengthIconKind;
}

const ICON_BY_KIND: Record<TopStrengthIconKind, StaticImageData> = {
  supportInformation: clearInformationIcon,
  adjustments: adjustmentsIcon,
  overallExperience: overallExperienceIcon,
  communication: commClearIcon,
};

export default function TopStrengthAreaIcon({
  kind,
}: TopStrengthAreaIconProps) {
  const src = ICON_BY_KIND[kind];

  return (
    <span className={styles.root}>
      <Image
        src={src}
        alt=''
        fill
        sizes='(max-width: 767px) 45vw, 200px'
        unoptimized
        className={styles.image}
      />
    </span>
  );
}
