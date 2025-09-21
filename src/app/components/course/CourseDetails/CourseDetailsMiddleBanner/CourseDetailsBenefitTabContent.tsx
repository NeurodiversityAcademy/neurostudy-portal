import { COURSE_BENEFIT_SUPPORT_AVAILABLE } from '@/app/utilities/course/constants';
import { useCourseDetailsContext } from '@/app/utilities/course/CourseDetailsProvider';
import Image from 'next/image';
import CircleTick from '@/app/images/circle-tick.png';
import styles from '../../CourseDetails/courseDetails.module.css';
import Accordion from '@/app/components/accordion/Accordian';
import { useState } from 'react';

// Define concrete interfaces
interface JobRequirements {
  [requirement: string]: string; // requirement name -> level
}

interface JobLevels {
  junior: JobRequirements;
  senior: JobRequirements;
  lead: JobRequirements;
  [level: string]: JobRequirements; // Allow for additional levels
}

interface JobData {
  requirements: JobLevels;
}

interface PossibleJobRequirements {
  [jobTitle: string]: JobData;
}

interface SupportAvailable {
  AssessmentAdjustments: string[];
  LearningDeliveryAdjustments: string[];
  EnvironmentalAdjustments: string[];
  [category: string]: string[]; // Allow for additional categories
}

interface CourseData {
  PossibleJobRequirement: PossibleJobRequirements;
  SupportAvailable: SupportAvailable;
  Adjustments: string[];
  // Add other properties as needed
}

interface CourseDetailBenefitTabContentProps {
  activeTab: string;
}

const CourseDetailsBenefitTabContent: React.FC<
  CourseDetailBenefitTabContentProps
> = ({ activeTab }) => {
  const course = useCourseDetailsContext();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const { data } = course;

  // Type-safe data access
  const courseData = data as unknown as CourseData;

  // Debug log with proper typing
  Object.entries(courseData?.PossibleJobRequirement || {}).forEach(
    ([jobTitle, jobData]) => {
      console.log('jobTitle', jobTitle, 'jobData', jobData);
    }
  );

  switch (activeTab) {
    case 'support':
      return (
        <div className={styles.supportAccordionContainer}>
          {courseData?.SupportAvailable &&
            Object.entries(courseData.SupportAvailable).map(
              ([category, items]) => (
                <div className={styles.supportContainer} key={category}>
                  <Accordion
                    key={category}
                    title={category.replace(/([A-Z])/g, ' $1').trim()}
                  >
                    <div className={styles.supportCategory}>
                      <ul className={styles.supportAvailableList}>
                        {items.map((item: string, index: number) => {
                          const support =
                            COURSE_BENEFIT_SUPPORT_AVAILABLE[
                              item as keyof typeof COURSE_BENEFIT_SUPPORT_AVAILABLE
                            ];
                          return (
                            <div
                              key={index}
                              className={styles.supportAvailableListItem}
                            >
                              {support?.icon && (
                                <Image
                                  src={support.icon}
                                  alt={support.label}
                                  className={styles.supportIcon}
                                  key={index}
                                />
                              )}
                              <div>{support?.label}</div>
                            </div>
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

    case 'adjustment':
      return (
        <>
          <ul className={styles.adjustmentAvailableList}>
            {courseData?.Adjustments?.map((item, index) => (
              <div key={index} className={styles.adjustmentAvailableListItem}>
                <div>
                  <Image src={CircleTick} alt={item} />
                </div>
                <div>{item}</div>
              </div>
            ))}
          </ul>
        </>
      );

    case 'jobs':
      return (
        <div className={styles.jobRequirementsContainer}>
          {Object.entries(courseData?.PossibleJobRequirement || {}).map(
            ([jobTitle, jobData]) => (
              <div className={styles.jobContainer} key={jobTitle}>
                <Accordion
                  key={jobTitle}
                  title={jobTitle.replace(/([A-Z])/g, ' $1').trim()}
                >
                  <div key={jobTitle} className={styles.jobCard}>
                    <h3 className={styles.jobTitle}>{jobTitle}</h3>
                    <div className={styles.levelChips}>
                      {Object.keys(jobData.requirements).map((level) => (
                        <button
                          key={level}
                          className={`${styles.levelChip} ${
                            selectedLevel === level ? styles.selected : ''
                          }`}
                          onClick={() => setSelectedLevel(level)}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                    {selectedLevel && jobData.requirements[selectedLevel] && (
                      <div className={styles.requirementsList}>
                        {Object.entries(
                          jobData.requirements[selectedLevel]
                        ).map(([req, level]) => (
                          <div key={req} className={styles.requirementItem}>
                            <div className={styles.requirement}>{req}</div>
                            <div className={styles[`level${level}`]}>
                              {level}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Accordion>
              </div>
            )
          )}
        </div>
      );

    default:
      return null;
  }
};

export default CourseDetailsBenefitTabContent;
