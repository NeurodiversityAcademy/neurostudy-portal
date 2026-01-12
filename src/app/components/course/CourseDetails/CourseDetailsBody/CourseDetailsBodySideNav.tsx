'use client';

import React from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import Typography, { TypographyVariant } from '../../../typography/Typography';
import ActionButton from '../../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

type OverviewProps = {
  sections: { id: string; title: string }[];
};

const CourseDetailsBodySideNav: React.FC<OverviewProps> = ({ sections }) => {
  return (
    <nav className={styles.courseDetailsOverviewContainer}>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>
              <Typography variant={TypographyVariant.Body2Strong}>
                {section.title}
              </Typography>
            </a>
          </li>
        ))}

        {/* Actions placed as the last list item so they are part of the section (not a separate scrollable area) */}
        <li className={styles.courseDetailsOverviewActionsLi}>
          <div className={styles.courseDetailsOverviewActions}>
            <ActionButton
              label='Apply Now'
              style={BUTTON_STYLE.Primary}
              type='button'
              className={styles.courseDetailsSidebarButton}
              fullWidth={true}
            />

            <ActionButton
              label='Shortlist'
              style={BUTTON_STYLE.Secondary}
              type='button'
              className={styles.courseDetailsSidebarButton}
              fullWidth={true}
            />
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default CourseDetailsBodySideNav;
