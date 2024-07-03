import React from 'react';
import ActionButton from '../buttons/ActionButton';
import styles from './contact.module.css';
import { BUTTON_STYLE } from '@/app/utilities/constants';

const Contact = () => {
  return (
    <ActionButton
      label='Contact us'
      style={BUTTON_STYLE.Primary}
      className={styles.primaryBtn}
      to='/contact'
    />
  );
};

export default Contact;
