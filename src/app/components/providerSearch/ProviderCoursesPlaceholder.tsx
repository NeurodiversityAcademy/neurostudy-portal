'use client';

import { useEffect } from 'react';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import ActionButton from '@/app/components/buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { buildEndorsedLiveDetailHref } from '@/app/utilities/demoAccess';
import { trackProviderCoursesPlaceholderView } from '@/app/utilities/providerSearch/providerSearchGa';
import styles from './providerCoursesPlaceholder.module.css';

type ProviderCoursesPlaceholderProps = {
  providerSlug: string;
  providerName: string;
};

export default function ProviderCoursesPlaceholder({
  providerSlug,
  providerName,
}: ProviderCoursesPlaceholderProps) {
  useEffect(() => {
    trackProviderCoursesPlaceholderView(providerSlug);
  }, [providerSlug]);

  return (
    <main className={styles.page}>
      <Typography variant={TypographyVariant.H1} color={TypographyColorToken.BondBlack}>
        Courses from {providerName}
      </Typography>
      <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
        Courses are coming soon. In the meantime, explore this provider&apos;s endorsed profile.
      </Typography>
      <ActionButton
        type='button'
        label='View provider profile'
        style={BUTTON_STYLE.Primary}
        to={buildEndorsedLiveDetailHref(providerSlug)}
      />
    </main>
  );
}
