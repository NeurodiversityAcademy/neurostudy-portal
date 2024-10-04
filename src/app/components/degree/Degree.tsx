import React from 'react';
import styles from './degree.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import DegreeAvaliable from '../degreeavaliable/DegreeAvaliable';
// import SearchBar from '../searchBar/SearchBar';

export default function Degree() {
  return (
    <>
      <div className={styles.degreeContainer}>
        <div className={styles.bannerTextAndBadge}>
          <div className={styles.textContainer}>
            <div className={styles.textHeader}>
            <Typography
                variant={TypographyVariant.Body1}
                color='var(--GhostWhite)'
              >
                University of Michigan
              </Typography>
              <Typography
                variant={TypographyVariant.H1}
                color='var(--GhostWhite)'
              >
                Applyed Data Science
              </Typography>
            </div>
            <div className={styles.textBody}>
            <Typography
                variant={TypographyVariant.H2}
                color='var(--GhostWhite)'
              >
                Bachleor Degree(honors)
              </Typography>
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--GhostWhite)'
              >
                Information about the institute or university in 2-3 lines or a
                paragraph a very short description this is optional
              </Typography>
            </div>
          </div>
          <div>
            <DegreeAvaliable>



            </DegreeAvaliable>
          </div>
        </div>
        {/*<div className={styles.descktopSearchBar}>
           <SearchBar></SearchBar>
        </div> */}
      </div>
      {/* <div className={styles.mobileSearchBar}>
        <SearchBar></SearchBar> 
      </div> */}
    </>
  );
}
