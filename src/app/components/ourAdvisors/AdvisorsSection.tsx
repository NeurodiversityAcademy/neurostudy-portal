import React from 'react';
import Image from 'next/image';
import styles from './AdvisorsSection.module.css';

const advisors = [
  {
    name: 'Farhan Rahman',
    role: 'Head of Support',
    imageUrl: '/images/farhan.jpeg',
    logo: '/images/stripe.jpeg',
  },
  {
    name: 'Nayeem Hasan',
    role: 'Chief Technology Officer',
    imageUrl: '/images/nayeem.jpeg',
    logo: '/images/asus.jpeg',
  },
  {
    name: 'Sabina Ahmed',
    role: 'Marketing Manager',
    imageUrl: '/images/sabina.jpeg',
    logo: '/images/intel.jpeg',
  },
  {
    name: 'Imran Karim',
    role: 'Operations Manager',
    imageUrl: '/images/imran.jpeg',
    logo: '/images/oracle.jpeg',
  },
];

const AdvisorsSection = () => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Our Advisors</h2>
      <div className={styles.grid}>
        {advisors.map((advisor, index) => (
          <div key={index} className={styles.card}>
            <Image
              src={advisor.imageUrl}
              alt={`${advisor.name}'s photo`}
              className={styles.image}
              width={100}
              height={100}
            />
            <h3 className={styles.name}>{advisor.name}</h3>
            <p className={styles.role}>{advisor.role}</p>
            <Image
              src={advisor.logo}
              alt={`${advisor.name}'s company logo`}
              className={styles.logo}
              width={60}
              height={60}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvisorsSection;
