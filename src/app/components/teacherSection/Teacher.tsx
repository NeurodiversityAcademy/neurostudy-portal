'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './teacher.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
import DialogPopUp from '../popupSubscribe/DialogComponent';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import useHideOverflowEffect from '@/app/hooks/useHideOverflowEffect';

export default function Teacher() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const hideOverflow = useHideOverflowEffect();

  useEffect(() => {
    if (isModalOpen) {
      return hideOverflow();
    }
  }, [isModalOpen, hideOverflow]);

  return (
    <div className={styles.teacherContainer}>
      <div>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Are you interested in Neurodiversity training?
        </Typography>
      </div>
      <div className={styles.teacherBodyText}>
        <Typography variant={TypographyVariant.Body1} color='var(--BondBlack)'>
          Use our best in class courses to equip yourself with the tools you
          need to become better and you can improve your employability with our
          certificate.
        </Typography>
      </div>
      <ActionButton
        label='Subscribe'
        style={BUTTON_STYLE.Primary}
        onClick={toggleModal}
        className={'mt-4'}
      />
      {isModalOpen && <DialogPopUp onClose={toggleModal} />}
    </div>
  );
}
