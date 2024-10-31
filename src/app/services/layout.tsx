import React from 'react';
import CourseEnrolPrompt from '../components/course/CourseEnrolPrompt';
import Contact from '../components/contact/Contact';
import Subscribe from '../components/subscribe/subscribe';
import styles from './services.module.css';

interface ServicePageLayoutProp {
  children: React.ReactNode;
}

const ServicePageLayout = ({ children }: ServicePageLayoutProp) => {
  return (
    <div className={styles.servicesPageContainer}>
      <CourseEnrolPrompt />
      {children}
      <Contact />
      <Subscribe />
    </div>
  );
};

export default ServicePageLayout;
