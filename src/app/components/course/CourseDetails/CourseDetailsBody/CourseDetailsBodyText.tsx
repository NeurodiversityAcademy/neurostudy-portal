import DOMPurify from 'isomorphic-dompurify';
import React from 'react';
import Typography, { TypographyVariant } from '../../../typography/Typography';
import styles from '../../CourseDetails/courseDetails.module.css';
import ActionButton from '@/app/components/buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

interface CourseDetailsBodyTextProps {
  id: string;
  data: string | undefined;
}

const CourseDetailsBodyText: React.FC<CourseDetailsBodyTextProps> = ({
  id,
  data,
}) => {
  const paragraphs = data?.split('\n').map((paragraph, index) => {
    const sanitizedHTML = DOMPurify.sanitize?.(paragraph);
    return (
      <div key={index} className={styles.courseDetailsBodyText}>
        <Typography key={index} variant={TypographyVariant.Body2}>
          <div
            className={styles.paragraph}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        </Typography>
        <br></br>
        {id === 'tuitionFees' && (
          <ActionButton
            type='button'
            label='View Tuition Fees'
            style={BUTTON_STYLE.Primary}
            to={'/#'}
          />
        )}
      </div>
    );
  });

  return (
    <div {...{ id }}>
      <div>{paragraphs}</div>
    </div>
  );
};

export default CourseDetailsBodyText;
