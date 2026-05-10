import Accordion from '@/app/components/accordion/Accordian';
import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import type { EndorsedFaqSection } from './endorsedProviderPageData';
import styles from './endorsedProvidersFaqs.module.css';

interface EndorsedProvidersFAQsProps {
  sections: EndorsedFaqSection[];
}

export default function EndorsedProvidersFAQs({
  sections,
}: EndorsedProvidersFAQsProps) {
  if (!sections.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby='endorsed-faqs-heading'>
      <Typography
        id='endorsed-faqs-heading'
        variant={TypographyVariant.H3}
        color={TypographyColorToken.BondBlack}
        className={styles.title}
      >
        Frequently asked questions
      </Typography>

      <div className={styles.sectionGroup}>
        {sections.map((faqSection) => (
          <div key={faqSection.sectionTitle} className={styles.faqSection}>
            <Typography
              variant={TypographyVariant.Body2Strong}
              color={TypographyColorToken.BondBlack}
              className={styles.sectionTitle}
            >
              {faqSection.sectionTitle}
            </Typography>

            <div className={styles.items}>
              {faqSection.items.map((item) => (
                <Accordion
                  key={item.question}
                  title={item.question}
                  startExpanded={false}
                  className={styles.faqAccordion}
                >
                  <Typography
                    variant={TypographyVariant.Body2}
                    color={TypographyColorToken.BondBlackVariant}
                  >
                    {item.answer}
                  </Typography>
                </Accordion>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
