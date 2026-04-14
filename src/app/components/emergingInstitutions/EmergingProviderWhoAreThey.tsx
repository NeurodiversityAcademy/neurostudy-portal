import Accordion from '@/app/components/accordion/Accordian';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './emergingInstitutions.module.css';

const QILT_AREAS = [
  'Overall student experience',
  'Skills development',
  'Teaching practices',
  'Student support and services',
  'Interactions with other students',
  'Facilities and resources',
] as const;

const QILT_AREA_ROWS = [
  [QILT_AREAS[0], QILT_AREAS[1]],
  [QILT_AREAS[2], QILT_AREAS[3]],
  [QILT_AREAS[4], QILT_AREAS[5]],
] as const;

export default function EmergingProviderWhoAreThey() {
  return (
    <section className={styles.providerWhoSection}>
      <div className={styles.providerWhoCard}>
        <Accordion
          title='Who are Emerging Providers?'
          startExpanded={true}
          className={styles.providerWhoAccordion}
        >
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlackVariant)'
            className={styles.providerWhoLead}
          >
            Emerging Providers are education organisations that perform strongly
            across multiple areas of the national QILT Student Experience
            Survey.
          </Typography>
          <Typography variant={TypographyVariant.Body3}>
            When identifying Emerging Providers, Neurodiversity Academy reviews
            six key areas measured by QILT:
          </Typography>
          <table className={styles.providerWhoAreasTable}>
            <tbody>
              {QILT_AREA_ROWS.map((row, index) => (
                <tr key={index}>
                  {row.map((area) => (
                    <td key={area} className={styles.providerWhoAreaCell}>
                      <Typography variant={TypographyVariant.Body3Strong}>
                        {area}
                      </Typography>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Typography
            variant={TypographyVariant.Body2Strong}
            className={styles.providerWhoSubheading}
          >
            Why these areas?
          </Typography>
          <Typography variant={TypographyVariant.Body3}>
            These areas reflect the quality of teaching, learning environments,
            and student support that can benefit neurodivergent learners.
            Interactions with other students and facilities are also considered,
            while still allowing providers that are only slightly below national
            average benchmarks in those categories.
          </Typography>
          <Typography variant={TypographyVariant.Body3}>
            Neurodiversity Academy focuses on building inclusive environments
            where different ways of thinking and learning are recognised and
            supported so all students can thrive.
          </Typography>
        </Accordion>
      </div>
    </section>
  );
}
