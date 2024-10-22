'use client';

import React from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import Typography, { TypographyVariant } from '../../../typography/Typography';

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
      </ul>
    </nav>
  );
};

export default CourseDetailsBodySideNav;
