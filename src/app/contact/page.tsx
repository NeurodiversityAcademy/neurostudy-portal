import React from 'react';
import styles from './contact.module.css';
import ContactUsForm from '../components/contactUs/ContactUsForm';
import { Metadata } from 'next';
import { META_KEY } from '../utilities/constants';
import { createMetadata } from '../utilities/common';

export const metadata: Metadata = createMetadata(META_KEY.CONTACT);

export default function Page() {
  return (
    <div className={styles.container}>
      <ContactUsForm />
    </div>
  );
}
