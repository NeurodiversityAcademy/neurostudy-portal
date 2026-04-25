'use client';

import { useCourseDetailsContext } from '@/app/utilities/course/CourseDetailsProvider';
import type { CourseDetailsProps } from '@/app/interfaces/Course';
import styles from '@/app/components/course/CourseDetails/courseDetails.module.css';
import Accordion from '@/app/components/accordion/Accordian';
import CheckIcon from '@/app/components/images/Check';
import type { CourseBenefitsContentSource } from './tabSectionTypes';

function prettifyLabel(value: string) {
  return value.replace(/([A-Z])/g, ' $1').trim();
}

export interface CourseDetailsBenefitsBodyProps {
  source: CourseBenefitsContentSource;
}

export default function CourseDetailsBenefitsBody({
  source,
}: CourseDetailsBenefitsBodyProps) {
  const { data } = useCourseDetailsContext();
  const courseData = data as CourseDetailsProps | undefined;

  if (!courseData) {
    return null;
  }

  switch (source) {
    case 'support':
      return (
        <ul className={styles.supportAvailableList}>
          {courseData.SupportAvailable?.map((item, index) => {
            const label = prettifyLabel(item);
            return (
              <li key={index} className={styles.supportAvailableListItem}>
                <CheckIcon
                  className={styles.adjustmentIcon}
                  aria-hidden='true'
                />
                <p>{label}</p>
              </li>
            );
          })}
        </ul>
      );

    case 'adjustment':
      return (
        <div className={styles.adjustmentAccordionContainer}>
          {courseData.AdjustmentsAvailable &&
            Object.entries(courseData.AdjustmentsAvailable).map(
              ([category, items]) => (
                <div className={styles.supportContainer} key={category}>
                  <Accordion title={prettifyLabel(category)}>
                    <div className={styles.adjustmentCategory}>
                      <ul className={styles.adjustmentAvailableList}>
                        {items.map((item: string, index: number) => {
                          const label = prettifyLabel(item);
                          return (
                            <li
                              key={index}
                              className={styles.adjustmentAvailableListItem}
                            >
                              <CheckIcon
                                className={styles.adjustmentIcon}
                                aria-hidden='true'
                              />
                              <div>{label}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Accordion>
                </div>
              )
            )}
        </div>
      );

    case 'jobs': {
      const jobs = courseData.PossibleJobRequirement ?? {};
      return (
        <div className={styles.jobRequirementsContainer}>
          {Object.entries(jobs).map(([jobTitle, jobData]) => (
            <div className={styles.jobContainer} key={jobTitle}>
              <Accordion title={prettifyLabel(jobTitle)}>
                <div className={styles.jobCard}>
                  <ul className={styles.adjustmentAvailableList}>
                    {Object.entries(jobData.requirements).flatMap(
                      ([level, reqs]) =>
                        Object.entries(reqs).map(([req, levelValue]) => {
                          const levelLabel = String(levelValue);
                          const levelClass =
                            styles[`level${levelLabel}` as keyof typeof styles];
                          return (
                            <li
                              key={`${level}-${req}`}
                              className={styles.adjustmentAvailableListItem}
                            >
                              <CheckIcon
                                className={styles.adjustmentIcon}
                                aria-hidden='true'
                              />
                              <div>
                                {prettifyLabel(req)} —{' '}
                                <span className={levelClass}>{levelLabel}</span>{' '}
                                ({level})
                              </div>
                            </li>
                          );
                        })
                    )}
                  </ul>
                </div>
              </Accordion>
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
