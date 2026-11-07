import type { Metadata } from 'next';
import Link from 'next/link';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import styles from './howWeRank.module.css';

export const metadata: Metadata = {
  title: 'How we rank providers | Neurodiversity Academy',
  description:
    'How Neurodiversity Academy orders endorsed and emerging education providers in search results.',
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_REVIEWED = '4 November 2026';

export default function HowWeRankPage() {
  return (
    <main className={styles.page}>
      <article className={styles.column}>
        <Typography variant={TypographyVariant.H1} color={TypographyColorToken.BondBlack}>
          How we rank providers
        </Typography>

        <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
          Search results are ordered in three groups: NDA-endorsed providers with courses, other
          NDA-endorsed providers, and emerging providers. The order is produced by a fixed set of
          rules, not by an AI model, and the same inputs always produce the same order.
        </Typography>

        <section className={styles.section}>
          <Typography variant={TypographyVariant.H2} color={TypographyColorToken.BondBlack}>
            Endorsed providers
          </Typography>
          <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
            Within the endorsed groups, NDA-certified providers come first. The rest are ordered by
            the number of support commitments verified as in place, with more verified supports
            ranked higher. We show both the number in place and the number still in the works. We do
            not rank by the proportion completed, because a provider that lists fewer commitments
            should not outrank one that has disclosed and verified more.
          </Typography>
        </section>

        <section className={styles.section}>
          <Typography variant={TypographyVariant.H2} color={TypographyColorToken.BondBlack}>
            Emerging providers
          </Typography>
          <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
            Emerging providers are ordered by a student-experience index calculated from the QILT
            Student Experience Survey. For each of the six survey dimensions we take the provider’s
            result minus the national average, then average those differences. We publish an index
            only when at least four dimensions are available, and we show the response count beside
            every figure so small samples are visible.
          </Typography>
          <Typography
            variant={TypographyVariant.Body2}
            color={TypographyColorToken.BondBlackVariant}
          >
            QILT does not survey VET providers, so no QILT figure is shown for them. The
            student-experience index orders providers within the emerging group only; it does not
            determine the order across the three groups. Smaller providers can score highly on this
            index, which is why the response count is always shown and why the index is presented as
            one signal rather than a verdict.
          </Typography>
        </section>

        <section className={styles.section}>
          <Typography variant={TypographyVariant.H2} color={TypographyColorToken.BondBlack}>
            What we do not do
          </Typography>
          <ul className={styles.list}>
            <li>We do not blend endorsement and survey data into a single score.</li>
            <li>We do not use “best”, “top” or “recommended for you” labels.</li>
            <li>We do not let an AI model rank, score or recommend providers.</li>
            <li>We do not show a QILT figure where QILT does not publish one.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <Typography variant={TypographyVariant.H2} color={TypographyColorToken.BondBlack}>
            Sources
          </Typography>
          <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
            Student experience figures are derived from the{' '}
            <a
              className={styles.link}
              href='https://www.qilt.edu.au/surveys/student-experience-survey-(ses)'
              target='_blank'
              rel='noopener noreferrer'
            >
              QILT Student Experience Survey
            </a>
            . Endorsement and support-commitment status come from NDA’s own verification work with
            each provider.
          </Typography>
        </section>

        <section className={styles.section}>
          <Typography variant={TypographyVariant.H2} color={TypographyColorToken.BondBlack}>
            Change log
          </Typography>
          <ul className={styles.list}>
            <li>
              <strong>{LAST_REVIEWED}</strong> — First published. Endorsed providers ordered by
              verified supports in place; emerging providers ordered by the QILT student-experience
              index.
            </li>
          </ul>
          <Typography
            variant={TypographyVariant.Body2}
            color={TypographyColorToken.BondBlackVariant}
          >
            Last reviewed: {LAST_REVIEWED}.
          </Typography>
        </section>

        <Typography variant={TypographyVariant.Body2} color={TypographyColorToken.BondBlackVariant}>
          <Link className={styles.link} href='/search'>
            Back to provider search
          </Link>
        </Typography>
      </article>
    </main>
  );
}
