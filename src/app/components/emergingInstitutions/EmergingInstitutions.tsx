import Image from 'next/image';
import styles from './emergingInstitutions.module.css';
import cardData from './emergingInstitutions.json';
import graduationCap from '../../images/graduationCap.png';
import Typography, { TypographyVariant } from '../typography/Typography';
import EmergingInstitutionCard from './EmergingInstitutionCard';
import { slugify } from '@/app/utilities/common';

type InstitutionCard = {
  name: string;
};

export default function EmergingInstitutions() {
  const institutions = cardData as InstitutionCard[];

  return (
    <section className={styles.section} id='emerging-institutions'>
      <div className={styles.container}>
        <div className={styles.header}>
          <Image
            src={graduationCap}
            alt='Graduation cap icon'
            className={styles.icon}
          />
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            NDA Emerging Providers
          </Typography>
        </div>
        <Typography
          variant={TypographyVariant.Body1}
          color='var(--BondBlackVariant)'
          className={styles.subtitle}
        >
          Emerging Providers are organisations with developing practices and
          strong potential for neuro-inclusive education.
        </Typography>

        <div className={styles.cards}>
          {institutions.map((institution) => (
            <EmergingInstitutionCard
              key={institution.name}
              name={institution.name}
              href={`/emergingproviders/${slugify(institution.name)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
