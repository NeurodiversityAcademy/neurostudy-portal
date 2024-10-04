'use client';
import React from 'react';
import styles from './coursedetail.module.css';
import Typography, {  TypographyVariant,} from '../components/typography/Typography';
import Degree from '../components/degree/Degree';
import useWindowWidth from '@/app/hooks/useWindowWidth';
import Link from 'next/link';
import courseData from './courseData.json';
import ActionButton from '../components/buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

export default function Page() {
  const windowWidth = useWindowWidth();
    const { courses } = courseData;
  return (
    
    <div className={styles.container}>
      <div>
        <Typography
          variant={
            windowWidth <= 430
              ? TypographyVariant.Body3Strong
              : TypographyVariant.Body2Strong
          }
        >
          <Link href='/'>Home</Link> {'>'} <Link href='/degrees'>Degrees</Link>{' '}
          {'>'} 
        </Typography>
      </div>
      <Degree />

      <div className={styles.detailWrapper}>
      <nav className={styles.sidebar}> <ul> <li> 
          <a href="#section1">
            <ActionButton
              label='Course Overview'
              style={BUTTON_STYLE.Fourth}
              className='mb-3'
              iconPosition = 'left'
              /> </a></li> 
        <li>           <a href="#section2">
            <ActionButton
              label='Entry Requirements'
              style={BUTTON_STYLE.Fourth}
              className='mb-3'
              iconPosition = 'left'
              /> </a></li> 
        <li> <a href="#section3">
            <ActionButton
              label='Tuition&Fees'
              style={BUTTON_STYLE.Fourth}
              className='mb-3'
              iconPosition = 'left'
              /> </a> </li> 
        </ul> </nav> {/* 右侧内容 */} 


        <div className={styles.detailContainer}> {courses.map((course) => ( 
          <div key={course.id} className={styles.blogItem}> {/* 标题 */} 
              <Typography variant={TypographyVariant.H2}><section id="section1">Course Overview</section></Typography>
              <Typography variant={TypographyVariant.Body3}>{course.Overview}</Typography>
              <Typography variant={TypographyVariant.H2}><section id="section2">Entry Requirements</section></Typography>
              <Typography variant={TypographyVariant.Body3}>{course.Requirements}</Typography> 
              <Typography variant={TypographyVariant.H2}><section id="section3">Tuition&Fees</section></Typography>
              <Typography variant={TypographyVariant.Body3}>{course.Fees}</Typography>
          </div> ))} 
        </div> 
        </div>
    
    </div> ); }
