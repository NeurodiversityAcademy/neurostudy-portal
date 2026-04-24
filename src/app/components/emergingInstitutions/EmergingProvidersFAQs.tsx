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

export default function EmergingProvidersFAQs() {
  return (
    <section className={styles.emergingFAQSection}>
      <div className={styles.emergingFAQCard}>
        <Accordion
          title='Who are Emerging Providers?'
          startExpanded={false}
          className={styles.emergingFAQAccordion}
        >
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlackVariant)'
            className={styles.emergingFAQLead}
          >
            Emerging Providers are education organisations that perform strongly
            across multiple areas of the national QILT Student Experience
            Survey.
            <br/>
            Emerging providers must perform above the national
            average in four key areas that strongly influence a
            student’s learning environment and development:
          </Typography>
          <ul className={styles.emergingFAQKeyAreasList}>
            {QILT_AREAS.slice(0, 4).map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <Typography variant={TypographyVariant.Body3}>
            When identifying Emerging Providers, Neurodiversity Academy reviews
            six key areas measured by QILT:
          </Typography>
          <table className={styles.emergingFAQAreasTable}>
            <tbody>
              {QILT_AREA_ROWS.map((row, index) => (
                <tr key={index}>
                  {row.map((area) => (
                    <td key={area} className={styles.emergingFAQAreaCell}>
                      <Typography variant={TypographyVariant.Body3Strong}>
                        {area}
                      </Typography>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Accordion>
        <Accordion
          title='Why these areas?'
          startExpanded={false}
          className={styles.emergingFAQAccordion}
        >
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlackVariant)'
            className={styles.emergingFAQLead}
          >
            These areas reflect the quality of teaching,
            learning environments, and student support
            which may benefit neurodivergent learners.
            Interactions with other students and facilities
            are also considered, but organisations may
            still be included if they are slightly below the
            national average in these areas.
          </Typography>
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlackVariant)'
            className={styles.emergingFAQLead}
          >
            At Neurodiversity Academy, we believe
            neuro-inclusion is not about fixing the
            student, but about creating learning
            environments where different ways of
            thinking and learning are supported so all
            students can thrive.
          </Typography>
        </Accordion>
        <Accordion
          title={<span>Disclaimer<sup>*</sup></span>}
          startExpanded={true}
          className={styles.emergingFAQAccordion}
        >
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlackVariant)'
            className={styles.emergingFAQLead}
          >
            The information in these profiles has been
            compiled from publicly available sources
            using desktop research and AI-assisted tools.
            While every effort has been made to ensure
            accuracy, Neurodiversity Academy cannot
            guarantee all information is complete or up to
            date. We encourage readers to verify details
            directly with the relevant organisation.
          </Typography>
        </Accordion>
        <Accordion
          title={<span>Evidence Sources<sup>*</sup></span>}
          startExpanded={true}
          className={styles.emergingFAQAccordion}
        >
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlackVariant)'
            className={styles.emergingFAQLead}
          >
            <li>Provider website</li>
            <li>Student support pages</li>
            <li>QILT survey data</li>
            <li>Government provider listing</li>
          </Typography>
        </Accordion>
      </div>
    </section>
  );
}
