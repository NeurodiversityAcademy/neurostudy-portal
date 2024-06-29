'use client';
import React, { useCallback, useEffect } from 'react';
import styles from './teacher.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
import DialogPopUp from '../popupSubscribe/DialogComponent';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { useAppSelector } from '@/app/redux/store';
import { useDispatch } from 'react-redux';
import { toggleModal } from '@/app/redux/features/modal/modal-slice';

export default function Teacher() {
  const isModalOpen = useAppSelector((state) => state.modalReducer.isModalOpen);
  const dispatch = useDispatch();

  const handleToggleModal = useCallback(() => {
    dispatch(toggleModal());
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
  }, [isModalOpen]);

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
        label='Subscribe Us'
        style={BUTTON_STYLE.Primary}
        onClick={handleToggleModal}
        className={'mt-4'}
      />
      {isModalOpen && <DialogPopUp onClose={handleToggleModal} />}
    </div>
  );
}
