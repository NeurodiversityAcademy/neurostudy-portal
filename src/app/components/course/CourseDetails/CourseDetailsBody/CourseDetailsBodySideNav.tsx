'use client';

import React, { useState } from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import Typography, { TypographyVariant } from '../../../typography/Typography';

type OverviewProps = {
  sections: { id: string; title: string }[];
};

const CourseDetailsBodySideNav: React.FC<OverviewProps> = ({ sections }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleOnClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={styles.courseDetailsOverviewContainer}>
      <ul>
        {sections.map((section, index) => (
          <li
            key={section.id}
            onClick={() => handleOnClick(section.id)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <a>
              <Typography
                variant={TypographyVariant.Body2Strong}
                color={
                  hoveredIndex === index
                    ? 'var(--cherryPie)'
                    : 'var(--BondBlack)'
                }
              >
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
