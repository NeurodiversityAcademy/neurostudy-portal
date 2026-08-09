'use client';

import { useEffect } from 'react';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
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
      <header className={styles.header}>
        <Typography variant={TypographyVariant.H1} color={TypographyColorToken.BondBlack}>
          Courses from {providerName}
        </Typography>
        <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
          Course listings for this provider will appear here.
        </Typography>
      </header>

      <section className={styles.courseList} aria-label={`Courses from ${providerName}`}>
        <div className={styles.emptyCourseCard} role='status'>
          <Typography
            variant={TypographyVariant.Body2Strong}
            color={TypographyColorToken.BondBlack}
          >
            No courses listed yet
          </Typography>
          <Typography variant={TypographyVariant.Body2} color={TypographyColorToken.BondBlack}>
            Check back soon for promoted courses from {providerName}.
          </Typography>
        </div>
      </section>
    </main>
  );
}
