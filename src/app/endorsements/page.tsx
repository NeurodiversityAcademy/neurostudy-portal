'use client';
import React from 'react';
import styles from './endorsements.module.css';
import HomeBanner from '../components/banner/HomeBanner';
import Typography, {
  TypographyVariant,
} from '../components/typography/Typography';
import Image from 'next/image';
import bronzeBadge from '../images/bronzeBadge.svg';
import silverBadge from '../images/silverBadge.svg';
import goldBadge from '../images/goldBadge.svg';
// import Unify360 from '../images/logo_unify360.svg';
import ActionButton from '../components/buttons/ActionButton';
import { BUTTON_STYLE } from '../utilities/constants';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <HomeBanner displayBadges={false} />
      <div className={styles.endorsementContainer}>
        {/* <div>
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            Our endorsed insitutes
          </Typography>
        </div> */}
        <div className={styles.endorsementBodyText}>
          {/* <div className={styles.level}>
            <Image
              src={bronzeBadge}
              alt='Bronze Badge'
              className={styles.badge}
            />
          </div> */}
          <div>
            {/* <div>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
            </div> */}
            <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
              Why is endorsement necessary?
            </Typography>
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--BondBlack)'
            >
              Endorsement ensures that learning organisations meet the
              Neurodiversity Academy’s (NDA) neuro-inclusion standards. Only
              endorsed providers are eligible to appear on our platform, giving
              students confidence that these organisations are prepared to
              support neurodivergent learners effectively.
            </Typography>
          </div>
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            What are “ND Standards”?
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlack)'
          >
            ND Standards refer to a set of criteria developed by the
            Neurodiversity Academy to assess and recognise inclusive practices
            within learning organisations. These standards focus on inclusive
            curriculum design, staff awareness and training, accessible learning
            environments, effective use of assistive technology, and continuous
            improvement through feedback from neurodivergent students.
          </Typography>
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            What outcomes can a learning institute expect from being endorsed?
          </Typography>
          <div className={styles.flexRow}>
            <div className={styles.side}></div>
            <ul className={styles.centerList}>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Differentiation from non-inclusive providers
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Access to new or alternative funding opportunities
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Increased enrolments from neurodivergent students and their
                  networks
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Enhanced reputation and publicity as a neuro-inclusive
                  provider
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Potential for improved student retention and course completion
                  rates due to better support structures
                </Typography>
              </li>
            </ul>
            <div className={styles.side}></div>
          </div>
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            What does NDA expect from endorsed organisations?
          </Typography>
          <div className={styles.flexRow}>
            <div className={styles.side}></div>
            <ul className={styles.centerList}>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Alignment with and ongoing maintenance of neuro-inclusion
                  standards
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Clear policies and procedures to support neurodivergent
                  learners
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Participation in regular feedback and review processes
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Engagement in continuous improvement initiatives
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Contribution to broader awareness and adoption of inclusive
                  practices in the sector
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Additional revenue stream to sustain and grow NDA initiatives
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Informed student decision-making, leading to higher
                  satisfaction and improved outcomes
                </Typography>
              </li>
              <li>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  A sector-wide shift as non-endorsed organisations recognise
                  the benefits of becoming inclusive
                </Typography>
              </li>
            </ul>
            <div className={styles.side}></div>
          </div>
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            What does NDA <i>not</i> expect from endorsement?
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlack)'
          >
            Endorsement is not a guarantee of perfect outcomes or that every
            challenge will be eliminated. Students may still face difficulties,
            and not all learners will achieve successful outcomes—but the
            endorsement confirms that the organisation is actively working to
            provide the right support, systems, and mindset for neurodivergent
            students to thrive.
          </Typography>
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            What does a student gain from studying at a Bronze, Silver, or Gold
            endorsed institute?
          </Typography>
          <div className={styles.flexRow}>
            <div className={styles.side}></div>
            <ul className={`${styles.centerList} ${styles.noBullets}`}>
              <li>
                <div className={styles.level}>
                  <Image
                    src={bronzeBadge}
                    alt='Bronze Badge'
                    className={styles.badge}
                  />
                </div>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Entry-level endorsement indicating that foundational practices
                  are in place. Staff are undergoing training, and inclusive
                  policies have been implemented. A solid starting point for
                  students seeking support, with a commitment to improving
                  further.
                </Typography>
              </li>
              <li>
                <div className={styles.level}>
                  <Image
                    src={silverBadge}
                    alt='Silver Badge'
                    className={styles.badge}
                  />
                </div>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Demonstrates consistent implementation of neuro-inclusive
                  practices across multiple areas. Students can expect a more
                  mature support system, increased staff capability, and access
                  to more embedded inclusive tools and services.
                </Typography>
              </li>
              <li>
                <div className={styles.level}>
                  <Image
                    src={goldBadge}
                    alt='Gold Badge'
                    className={styles.badge}
                  />
                </div>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--BondBlack)'
                >
                  Indicates strong, embedded practices with a culture of
                  inclusion across the entire organisation. Students can expect
                  a high level of support, well-trained staff, adaptive learning
                  technologies, and a strong track record of neurodivergent
                  student success.
                </Typography>
              </li>
            </ul>
            <div className={styles.side}></div>
          </div>
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            What are students expecting from endorsed providers?
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlack)'
          >
            Students expect that NDA-endorsed institutions have been
            independently assessed for their neuro-inclusive capabilities. This
            gives them confidence that the organisation will provide the right
            academic, emotional, and technological supports, leading to better
            study experiences, fewer barriers, and a more welcoming environment
            for learning and growth.
          </Typography>
        </div>
        <ActionButton
          style={BUTTON_STYLE.Primary}
          label='Contact us for endorsement'
          className={styles.enrolBtn}
          onClick={() => router.push('/contact')}
        />
      </div>
    </div>
  );
}
