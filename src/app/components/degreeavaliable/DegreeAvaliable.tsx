import React from 'react';
import styles from './degreeavaliable.module.css';
import ActionButton from '../buttons/ActionButton';
import Typography, { TypographyVariant } from '../typography/Typography';
import { BUTTON_STYLE } from '@/app/utilities/constants';
export default function DegreeAvaliable() {
  return (
    <div className={styles.textWrapper}>
            <Typography
                variant={TypographyVariant.H3}
                color='var(--black)'
              >
                2024 Admissions are open now
              </Typography>
              <Typography
                variant={TypographyVariant.Body2}
                color='var(--black)'
              >
                Get started today or request more infor about
              </Typography>
              <Typography
                variant={TypographyVariant.Body2}
                color='var(--black)'
              >
               the MADS degree.
              </Typography>
              <div  className={styles.buttonWrapper}>
                    <ActionButton
              label='Apply Now'
              onClick={() => console.log('clicked Apply Now button')}
              style={BUTTON_STYLE.Fourth}
              className='mb-3'
              iconPosition = 'left'
              
              />
               <ActionButton
              label='Shortlist'
              onClick={() => console.log('clicked Shortlist button')}
              style={BUTTON_STYLE.Secondary}
              className='mb-3'
              iconPosition = 'left'
              />
              </div>
    </div>
    
    

  );
}
