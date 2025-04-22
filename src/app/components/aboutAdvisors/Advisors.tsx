'use client';
import React from 'react';
import Image from 'next/image';
import PeterImage from '../../images/PeterHaasz.jpeg';
import JanImage from '../../images/JanCroeni.jpeg';
import JasonImage from '../../images/JasonWong.jpeg';
import LesleyImage from '../../images/LesleyGordon.jpeg';
import KatieImage from '../../images/KatieFleet.jpeg';
import MatthewImage from '../../images/MatthewWillis.jpeg';
import NatashaImage from '../../images/NatashaArthars.jpeg';
import linkedin from '../../images/linkedin.svg';

import styles from './advisors.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';

export default function Advisors() {
  const advisors = [
    // Business Advisory Board
    {
      ProfilePic: PeterImage,
      name: 'Peter Haasz',
      logo: linkedin,
      linkedin: 'https://www.linkedin.com/in/peterhaasz',
      company: 'Haasz Advisory',
      type: 'Business Advisor',
    },
    {
      ProfilePic: JanImage,
      name: 'Jan Croeni',
      logo: linkedin,
      linkedin: 'https://www.linkedin.com/in/jancroeni',
      company: 'Jan Croeni',
      type: 'Business Advisor',
    },

    // Events Advisory Board
    {
      ProfilePic: JasonImage,
      name: 'Jason Wong',
      logo: linkedin,
      linkedin: 'https://www.linkedin.com/in/jasonrwong',
      company: 'Tyger Technology Leadership',
      type: 'Event Advisor',
    },
    {
      ProfilePic: LesleyImage,
      name: 'Lesley Gordon',
      logo: linkedin,
      linkedin: 'https://www.linkedin.com/in/lesley-gordon-b59498136',
      company: 'TAFE NSW',
      type: 'Event Advisor',
    },

    // Academic Advisory Board
    {
      ProfilePic: KatieImage,
      name: 'Katie Fleet',
      logo: linkedin,
      linkedin: 'https://www.linkedin.com/in/katie-fleet-a02003a4',
      type: 'Academic Advisor',
    },
    {
      ProfilePic: MatthewImage,
      name: 'Matthew Willis',
      logo: linkedin,
      linkedin: 'https://www.linkedin.com/in/matthewjohnwillis',
      company: 'Learnt Group',
      type: 'Academic Advisor',
    },
    {
      ProfilePic: NatashaImage,
      name: 'Dr Natasha Arthars',
      logo: linkedin,
      linkedin: 'https://www.linkedin.com/in/natasha-arthars-08599736',
      company: 'Queensland University of Technology',
      type: 'Academic Advisor',
    },
  ];

  // Group advisors by their type
  const groupedAdvisors = advisors.reduce((acc, advisor) => {
    if (!acc[advisor.type]) {
      acc[advisor.type] = [];
    }
    acc[advisor.type].push(advisor);
    return acc;
  }, {} as Record<string, typeof advisors>);

  return (
    <div className={styles.container}>
      {Object.entries(groupedAdvisors).map(([type, advisors]) => (
        <div key={type} className={styles.section}>
          <Typography
            variant={TypographyVariant.H2}
            color="var(--GhostWhite)"
            className={styles.title}
          >
            Meet Our {type}s
          </Typography>
          <div className={styles.cardContainer}>
            {advisors.map((advisor, index) => (
              <div key={index} className={styles.card}>
                <Image
                  src={advisor.ProfilePic}
                  alt={`${advisor.name} photo`}
                  className={styles.image}
                />
                <div>
                  <Typography
                    variant={TypographyVariant.Body1}
                    color="var(--GhostWhite)"
                  >
                    {advisor.name}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant={TypographyVariant.Body2}
                    color="var(--GhostWhite)"
                    className={styles.company}
                  >
                    {advisor.company}
                  </Typography>
                </div>
                <div>
                  <Image
                    src={advisor.logo}
                    alt="LinkedIn icon"
                    className={styles.logo}
                    onClick={() => {
                      if (advisor.linkedin) {
                        window.open(advisor.linkedin, '_blank');
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
