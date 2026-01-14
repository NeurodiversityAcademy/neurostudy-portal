'use client';

import React from 'react';
import { useState } from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import Typography, { TypographyVariant } from '../../../typography/Typography';
import ActionButton from '../../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import ApplyNowPopup from '@/app/components/course/ApplyNowPopup/ApplyNowPopup';

type OverviewProps = {
  sections: { id: string; title: string }[];
};

const CourseDetailsBodySideNav: React.FC<OverviewProps> = ({ sections }) => {
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

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
        <li>
          <div className={styles.courseDetailsOverviewActions}>
            <ActionButton
              label='Apply Now'
              style={BUTTON_STYLE.Primary}
              type='button'
              onClick={() => setIsHandbookOpen(true)}
              className={styles.courseDetailsSidebarButton}
              fullWidth={true}
            />
            {/*
            <ActionButton
              label='Shortlist'
              style={BUTTON_STYLE.Secondary}
              type='button'
              className={styles.courseDetailsSidebarButton}
              fullWidth={true}
            />
            */}
          </div>
        </li>
      </ul>

      <ApplyNowPopup
        open={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />
    </nav>
  );
};

export default CourseDetailsBodySideNav;
