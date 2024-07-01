import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './footer.module.css';
import footerLogo from '../../images/footerLogo.jpg';
import Typography, { TypographyVariant } from '../typography/Typography';
import facebookIcon from '../../images/facebook.jpg';
import linkedinIcon from '../../images/linkedin.jpg';
import instagramicon from '../../images/instagram.jpg';
import twitterIcon from '../../images/twitter.jpg';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topLeft}>
          <Image src={footerLogo} alt='logo' />
          <div className={styles.footerDescription}>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              Neurodiversity Academy acknowledges the Traditional Owners of
              Country throughout Australia. We pay our respects to Elders past,
              present and emerging.
            </Typography>
          </div>
          <div className={styles.socials}>
            <a
              href='https://www.facebook.com/neurodiversityacademy'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Facebook'
              title='Visit our Facebook page'
            >
              <Image src={facebookIcon} alt='facebook-icon' />
            </a>
            <a
              href='https://www.linkedin.com/company/neurodiversity-academy/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Linkedin'
              title='Visit our Linkedin page'
            >
              <Image src={linkedinIcon} alt='linkedin-icon' />
            </a>
            <a
              href='https://www.instagram.com/neurodiversityacademy/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
              title='Visit our Instagram page'
            >
              <Image src={instagramicon} alt='instagram-icon' />
            </a>
            <a
              href='https://twitter.com/neuro_d_academy'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Twitter'
              title='Visit our Twitter page'
            >
              <Image src={twitterIcon} alt='twitter-icon' />
            </a>
          </div>
        </div>
        <div className={styles.topFoot}>
          <Typography
            className={styles.footerText}
            variant={TypographyVariant.Body1}
            color='var(--GhostWhite)'
          >
            Services
          </Typography>
          <ul>
            <li>
              <Link href='/services/neurodiversitytraining'>
                Neurodiversity Training
              </Link>
            </li>
            <li>
              <Link href='/services/advisoryconsulting'>
                Advisory Consulting
              </Link>
            </li>
            <li>
              <Link href='/services/networking'>Networking & Workshops</Link>
            </li>
            <li>
              <Link href='/services/coaching'>Career coaching</Link>
            </li>
            <li>
              <Link href='/services/placements'>Placements</Link>
            </li>
          </ul>
        </div>
        <div className={styles.topFoot}>
          <Typography
            className={styles.footerText}
            variant={TypographyVariant.Body1}
            color='var(--GhostWhite)'
          >
            Navigate
          </Typography>
          <ul>
            <li>
              <Link
                href='/blogs'
                rel='noopener noreferrer'
                aria-label='Blogs'
                title='visit Blogs page'
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href='/about'
                rel='noopener noreferrer'
                aria-label='About Us'
                title='visit About Us page'
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href='/contact'
                rel='noopener noreferrer'
                aria-label='Partner with Us'
                title='visit Partner with Us page'
              >
                Partner with Us
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.topFoot}>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--GhostWhite)'
          >
            Contact Us
          </Typography>
          <ul>
            {/* <li>
              <a href='tel:+123456789'>+61123456</a>
            </li> */}
            <li>
              <a href='mailto:info@neurodiversityacademy.com'>
                info@neurodiversityacademy.com
              </a>
            </li>
            {/* <li>
              <a
                href='https://www.google.com/maps?q=123+Lorem+Road,+Sydney,+2000'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Visit our office in Sydney'
                title='View our office location on Google Maps'
              >
                123, Lorem Road, Sydney, 2000
              </a>
            </li> */}
          </ul>
        </div>
      </div>
      <div className={styles.footprint}>
        <div className={styles.leftFootprint}>
          <Typography
            variant={TypographyVariant.Body2}
            color='var(--GhostWhite)'
          >
            &copy; 2024 All Rights Reserved
          </Typography>
        </div>
        <div className={styles.rightFootprint}>
          <Typography
            variant={TypographyVariant.Body2}
            color='var(--GhostWhite)'
          >
            Terms of Service
          </Typography>
          <a
            href='https://neurodiversityacademy927-my.sharepoint.com/:b:/g/personal/pratik_neurodiversityacademy_com/EXNxXkIM999Ot5uVj79jds0Bw4Q7b_rHPqA4bBDS3Q1acg?e=4Tnsi0'
            target='_blank'
            aria-label='Privacy policy (opens in new tab)'
            title='visit Privacy policy page'
          >
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              Privacy Policy
            </Typography>
          </a>
        </div>
      </div>
    </footer>
  );
}
