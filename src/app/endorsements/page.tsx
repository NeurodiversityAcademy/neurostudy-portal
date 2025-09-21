import React from 'react';
import styles from './endorsements.module.css';
import HomeBanner from '../components/banner/HomeBanner';
import Typography, {
  TypographyVariant,
} from '../components/typography/Typography';
// import Image, { StaticImageData } from 'next/image';
import Image from 'next/image';
import bronzeBadge from '../images/bronzeBadge.svg';
import silverBadge from '../images/silverBadge.svg';
import goldBadge from '../images/goldBadge.svg';
// import Unify360 from '../images/logo_unify360.svg';
import ActionButton from '../components/buttons/ActionButton';
import { BUTTON_STYLE } from '../utilities/constants';
import Link from 'next/link';
import Accordion from '../components/accordion/Accordian';
// import endorsedInstitutesData from './endorsedInstitutesData.json';

// import BlueprintCD from '../images/logo_blueprint_cd.jpeg';
// import AccessInstitute from '../images/logo_access_institute.jpeg';

// const instituteLogos: { [key: string]: StaticImageData } = {
//   'logo_blueprint_cd.jpeg': BlueprintCD,
//   'logo_access_institute.jpeg': AccessInstitute,
// };

export default function Page() {
  return (
    <div className={styles.container}>
      <HomeBanner displayBadges={false} />
      <div className={styles.endorsementContainer}>
        <div className={styles.endorsementBodyText}>
          {/* <div className={styles.accordionWrapper}>
            <div className={styles.instituteSection}>
              <Typography
                variant={TypographyVariant.H3}
                className={styles.instituteTitle}
              >
                Our endorsed institutes
              </Typography>
              <div className={styles.instituteList}>
                {endorsedInstitutesData.institutes.map((institute) => (
                  <a
                    key={institute.id}
                    href={institute.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.instituteCard}
                  >
                    <Image
                      src={instituteLogos[institute.logo]}
                      alt={`${institute.name} logo`}
                      title={institute.name}
                      className={styles.instituteLogo}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div> */}{' '}
          {/* Temporarily hiding endorsed institutes section bring back when endorsement is complete*/}
          <div className={styles.accordionWrapper}>
            <Accordion title='Why is endorsement necessary?'>
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--BondBlack)'
              >
                Endorsement ensures that learning organisations meet the
                Neurodiversity Academy’s (NDA) neuro-inclusion standards. Only
                endorsed providers are eligible to appear on our platform,
                giving students confidence that these organisations are prepared
                to support neurodivergent learners effectively.
              </Typography>
            </Accordion>
            <Accordion title='What are “ND Standards”?'>
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--BondBlack)'
              >
                ND Standards refer to a set of criteria developed by the
                Neurodiversity Academy to assess and recognise inclusive
                practices within learning organisations. These standards focus
                on inclusive curriculum design, staff awareness and training,
                accessible learning environments, effective use of assistive
                technology, and continuous improvement through feedback from
                neurodivergent students.
              </Typography>
            </Accordion>
            <Accordion title='What outcomes can a learning institute expect from being endorsed?'>
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--BondBlack)'
              >
                <ul className={styles.centerList}>
                  <li>Differentiation from non-inclusive providers</li>
                  <li>Access to new or alternative funding opportunities</li>
                  <li>
                    Increased enrolments from neurodivergent students and their
                    networks
                  </li>
                  <li>
                    Enhanced reputation and publicity as a neuro-inclusive
                    provider
                  </li>
                  <li>
                    Potential for improved student retention and course
                    completion rates due to better support structures
                  </li>
                </ul>
              </Typography>
            </Accordion>
            <Accordion title='What does NDA expect from endorsed organisations?'>
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--BondBlack)'
              >
                <ul className={styles.centerList}>
                  <li>
                    Alignment with and ongoing maintenance of neuro-inclusion
                    standards
                  </li>
                  <li>
                    Clear policies and procedures to support neurodivergent
                    learners
                  </li>
                  <li>
                    Participation in regular feedback and review processes
                  </li>
                  <li>Engagement in continuous improvement initiatives</li>
                  <li>
                    Contribution to broader awareness and adoption of inclusive
                    practices in the sector
                  </li>
                  <li>
                    Additional revenue stream to sustain and grow NDA
                    initiatives
                  </li>
                  <li>
                    Informed student decision-making, leading to higher
                    satisfaction and improved outcomes
                  </li>
                  <li>
                    A sector-wide shift as non-endorsed organisations recognise
                    the benefits of becoming inclusive
                  </li>
                </ul>
              </Typography>
            </Accordion>
            <Accordion title='What does NDA not expect from endorsement?'>
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--BondBlack)'
              >
                Endorsement is not a guarantee of perfect outcomes or that every
                challenge will be eliminated. Students may still face
                difficulties, and not all learners will achieve successful
                outcomes—but the endorsement confirms that the organisation is
                actively working to provide the right support, systems, and
                mindset for neurodivergent students to thrive.
              </Typography>
            </Accordion>
            <Accordion
              title='What does a student gain from studying at a Bronze, Silver, or Gold
            endorsed institute?'
            >
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--BondBlack)'
              >
                <ul className={`${styles.centerList} ${styles.noBullets}`}>
                  <li>
                    <div className={styles.level}>
                      <Image
                        src={bronzeBadge}
                        alt='Bronze Badge'
                        className={styles.badge}
                      />
                    </div>
                    Entry-level endorsement indicating that foundational
                    practices are in place. Staff are undergoing training, and
                    inclusive policies have been implemented. A solid starting
                    point for students seeking support, with a commitment to
                    improving further.
                  </li>
                  <li>
                    <div className={styles.level}>
                      <Image
                        src={silverBadge}
                        alt='Silver Badge'
                        className={styles.badge}
                      />
                    </div>
                    Demonstrates consistent implementation of neuro-inclusive
                    practices across multiple areas. Students can expect a more
                    mature support system, increased staff capability, and
                    access to more embedded inclusive tools and services.
                  </li>
                  <li>
                    <div className={styles.level}>
                      <Image
                        src={goldBadge}
                        alt='Gold Badge'
                        className={styles.badge}
                      />
                    </div>
                    Indicates strong, embedded practices with a culture of
                    inclusion across the entire organisation. Students can
                    expect a high level of support, well-trained staff, adaptive
                    learning technologies, and a strong track record of
                    neurodivergent student success.
                  </li>
                </ul>
              </Typography>
            </Accordion>
            <Accordion title='What are students expecting from endorsed providers?'>
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--BondBlack)'
              >
                Students expect that NDA-endorsed institutions have been
                independently assessed for their neuro-inclusive capabilities.
                This gives them confidence that the organisation will provide
                the right academic, emotional, and technological supports,
                leading to better study experiences, fewer barriers, and a more
                welcoming environment for learning and growth.
              </Typography>
            </Accordion>
          </div>
        </div>
        <Link href='/contact'>
          <ActionButton
            style={BUTTON_STYLE.Primary}
            label='Contact us for endorsement'
            className={styles.enrolBtn}
          />
        </Link>
      </div>
    </div>
  );
}
