import { COURSE_BENEFIT_SUPPORT_AVAILABLE } from '@/app/utilities/course/constants';
import { useCourseDetailsContext } from '@/app/utilities/course/CourseDetailsProvider';
import Image from 'next/image';
import CircleTick from '@/app/images/circle-tick.png';
import styles from '../../CourseDetails/courseDetails.module.css';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import Accordion from '@/app/components/accordion/Accordian';

interface CourseDetailBenefitTabContentProps {
  activeTab: string;
}

const CourseDetailsBenefitTabContent: React.FC<
  CourseDetailBenefitTabContentProps
> = ({ activeTab }) => {
  const course = useCourseDetailsContext();
  const { data } = course;

  switch (activeTab) {
    case 'support':
      return (
        <div className={styles.supportAccordionContainer}>
          {data?.SupportAvailable && Object.entries(data.SupportAvailable as unknown as Record<string, string[]>).map(([category, items]) => (
            <div className={styles.supportContainer} key={category}>
            <Accordion 
              key={category} 
              title={category.replace(/([A-Z])/g, ' $1').trim()}
            >
              
                <div className={styles.supportCategory}>
                  <ul>
                    {items.map((item: string, index: number) => {
                      const support = COURSE_BENEFIT_SUPPORT_AVAILABLE[
                        item as keyof typeof COURSE_BENEFIT_SUPPORT_AVAILABLE
                      ];
                      return (
                        <div key={index} className={styles.supportAvailableListItem}>
                          <div key={index}>{support?.icon && (
                            <Image src={support?.icon} alt={support?.label} className={styles.supportIcon}/>
                          )}</div>
                          <div>{support?.label}</div>
                        </div>
                      );
                    })}
                  </ul>
                </div>
            </Accordion>
            </div>
          ))}
        </div>
      );
    case 'adjustment':
      return (
        <>
          <ul className={styles.adjustmentAvailableList}>
            {data?.Adjustments.map((item, index) => (
                <div key={index}  className={styles.adjustmentAvailableListItem}>
                  <div><Image src={CircleTick} alt={item} /></div>
                  <div>{item}</div>
                </div>
            ))}
          </ul>
        </>
      );
    case 'jobs':
      return (
        <ul>
          {data?.PossibleJobRequirement.map((item, index) => {
            const [key, value] = item.split(':');
            return (
              <li className={styles.possibleJobRequirementListItem} key={index}>
                <span>{key}</span>
                <span>{value}</span>
              </li>
            );
          })}
        </ul>
      );
    default:
      return null;
  }
};

export default CourseDetailsBenefitTabContent;
