import type { ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import badgeGeneric from '../../images/badgeGeneric.png';
import graduationCap from '../../images/graduationCap.png';
import stepAssessed from '../../images/stepsEnquire.svg';
import stepIdentified from '../../images/stepsExplore.svg';
import stepFeedback from '../../images/stepsQuality.svg';
import styles from './endorsementProcess.module.css';

type EndorsementProcessStep = {
  id: string;
  title: string;
  description: ReactNode;
  icon: StaticImageData | string;
  iconClassName?: string;
  usesIconFrame?: boolean;
};

const ENDORSEMENT_PROCESS_STEPS: EndorsementProcessStep[] = [
  {
    id: 'assessed',
    title: 'Assessed',
    description: (
      <>
        Organisation completes the detailed
        <br />
        endorsement checklist.
      </>
    ),
    icon: stepAssessed,
  },
  {
    id: 'identified',
    title: 'Identified',
    description: (
      <>
        Neuroinclusion supports are identified,
        <br />
        and the organisation&apos;s neuro-inclusive practices are evaluated.
      </>
    ),
    icon: stepIdentified,
  },
  {
    id: 'endorsed',
    title: 'Endorsed',
    description: (
      <>
        Endorsement is agreed upon,
        <br />
        and the organisation is added to our platform.
      </>
    ),
    icon: badgeGeneric,
    iconClassName: styles.endorsedBadgeIcon,
    usesIconFrame: true,
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: (
      <>
        To maintain endorsement,
        <br />
        regular student feedback is assessed.
      </>
    ),
    icon: stepFeedback,
  },
  {
    id: 'student',
    title: 'Student',
    description: (
      <>
        Students can browse organisations on our platform
        <br />
        and explore available supports to choose the right place to study.
      </>
    ),
    icon: graduationCap,
    iconClassName: styles.studentIcon,
    usesIconFrame: true,
  },
];

export default function EndorsementProcess() {
  return (
    <section
      className={styles.section}
      aria-labelledby='endorsement-process-heading'
    >
      <Typography
        id='endorsement-process-heading'
        variant={TypographyVariant.H2}
        color={TypographyColorToken.PureWhite}
        className={styles.heading}
      >
        How does the endorsement work?
      </Typography>

      <ol className={styles.steps}>
        {ENDORSEMENT_PROCESS_STEPS.map((step) => (
          <li key={step.id} className={styles.step}>
            {step.usesIconFrame ? (
              <div className={styles.iconWrap}>
                <Image
                  src={step.icon}
                  alt=''
                  className={step.iconClassName}
                  width={72}
                  height={72}
                />
              </div>
            ) : (
              <Image
                src={step.icon}
                alt=''
                className={styles.stepIcon}
                width={109}
                height={109}
              />
            )}
            <div className={styles.stepText}>
              <Typography
                variant={TypographyVariant.Body1}
                color={TypographyColorToken.PureWhite}
                className={styles.stepTitle}
              >
                {step.title}
              </Typography>
              <Typography
                variant={TypographyVariant.Body2}
                color={TypographyColorToken.PureWhite}
                className={styles.stepDescription}
              >
                {step.description}
              </Typography>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
