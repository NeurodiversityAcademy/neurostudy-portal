import React from 'react';
import CourseEnrol from '../components/course/CourseEnrol';
import Contact from '../components/contact/Contact';
import Subscribe from '../components/subscribe/subscribe';
import styles from './services.module.css';

interface ServicePageLayoutProp {
  children: React.ReactNode;
}

const ServicePageLayout = ({ children }: ServicePageLayoutProp) => {
  return (
    <div className={styles.servicesPageContainer}>
      <CourseEnrol />
      {children}
      <Contact />
      <Subscribe />
    </div>
  );
};

export default ServicePageLayout;
