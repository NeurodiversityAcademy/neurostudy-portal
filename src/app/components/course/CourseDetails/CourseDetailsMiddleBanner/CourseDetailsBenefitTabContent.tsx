import { COURSE_BENEFIT_SUPPORT_AVAILABLE } from '@/app/utilities/course/constants';
import { useCourseDetailsContext } from '@/app/utilities/course/CourseDetailsProvider';
import Image from 'next/image';
import CircleTick from '@/app/images/circle-tick.png';
import styles from '../../CourseDetails/courseDetails.module.css';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';

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
        <ul>
          {data?.SupportAvailable.map((item, index) => {
            const support =
              COURSE_BENEFIT_SUPPORT_AVAILABLE[
                item as keyof typeof COURSE_BENEFIT_SUPPORT_AVAILABLE
              ];
            return (
              <li key={index} className={styles.supportAvailableListItem}>
                {support?.icon && (
                  <Image src={support?.icon} alt={support?.label} />
                )}
                <p>{support?.label}</p>
              </li>
            );
          })}
        </ul>
      );
    case 'adjustment':
      return (
        <>
          <ul>
            {data?.Adjustments.map((item, index) => (
              <li key={index} className={styles.adjustmentAvailableListItem}>
                <p className={styles.test}>
                  <Image src={CircleTick} alt={item} />
                  {item}
                </p>
              </li>
            ))}
          </ul>
          <p className={styles.adjustmenDisclaimer}>
            <Typography variant={TypographyVariant.Body3}>
              {' '}
              *These are possible reasonable adjustments that the learning
              organisation may be able to provide. They are not automatic and
              will be discussed and agreed upon with the organisation before you
              begin, as part of your individual support plan.
            </Typography>
          </p>
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
