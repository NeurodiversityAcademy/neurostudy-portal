'use client';
import styles from './navbar.module.css';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
// import MyLogin from '../buttons/MyLogin';
import Image from 'next/image';
import Logo from '../../images/Logo-navbar.svg';
import Hamburger from '../../images/hamburgerMenu.svg';
import Typography, { TypographyVariant } from '../typography/Typography';
import UserOutlet from './UserOutlet';
import { useAppSelector } from '@/app/redux/store';
import {
  toggleDropdown,
  closeDropdown,
} from '@/app/redux/features/navbar/navbar-slice';
import { useDispatch } from 'react-redux';

export default function Navbar() {
  const isDropdownVisible = useAppSelector(
    (state) => state.navBarReducer.isDropdownVisible
  );
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleToggleDropdown = () => {
    dispatch(toggleDropdown());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch(closeDropdown());
      }
    };
    if (isDropdownVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownVisible, dispatch]);

  return (
    <nav className={styles.nav}>
      <div className={styles.wrapper}>
        <Link className={styles.logo} href='/'>
          <Image src={Logo} alt='logo' />
        </Link>
        <div className={styles.innerWrapper}>
          <ul className={styles.ul}>
            <li className={styles.li}>
              <Link href='/neurodivergentmates'>
                <Typography variant={TypographyVariant.Body2}>
                  Neurodivergent Mates
                </Typography>
              </Link>
            </li>
            <li className={styles.li}>
              <div className={styles.dropdown}>
                <Typography variant={TypographyVariant.Body2}>
                  Services
                </Typography>
                <ul className={styles.dropdownContent}>
                  <li>
                    <Link href='/services/neurodiversitytraining'>
                      <Typography variant={TypographyVariant.Body2}>
                        Neurodiversity Training
                      </Typography>
                    </Link>
                  </li>
                  <li>
                    <Link href='/services/advisoryconsulting'>
                      <Typography variant={TypographyVariant.Body2}>
                        Advisory Consulting
                      </Typography>
                    </Link>
                  </li>
                  <li>
                    <Link href='/services/networking'>
                      <Typography variant={TypographyVariant.Body2}>
                        Networking & Workshops
                      </Typography>
                    </Link>
                  </li>
                  <li>
                    <Link href='/services/coaching'>
                      <Typography variant={TypographyVariant.Body2}>
                        Career coaching
                      </Typography>
                    </Link>
                  </li>
                  <li>
                    <Link href='/services/placements'>
                      <Typography variant={TypographyVariant.Body2}>
                        Placements
                      </Typography>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className={styles.li}>
              <Link href='/about'>
                <Typography variant={TypographyVariant.Body2}>
                  About Us
                </Typography>
              </Link>
            </li>
            <li className={styles.li}>
              <Link href='/contact'>
                <Typography variant={TypographyVariant.Body2}>
                  Contact
                </Typography>
              </Link>
            </li>
            {<UserOutlet />}
          </ul>
          {/* <MyLogin className={styles.login} /> */}
        </div>
        <Image
          className={styles.hamburger}
          src={Hamburger}
          alt='hamburger menu'
          onClick={handleToggleDropdown}
        />
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          {isDropdownVisible && (
            <ul className={`${styles.dropdownMenu}`}>
              <li className={styles.li}>
                <Link
                  href='/neurodivergentmates'
                  onClick={handleToggleDropdown}
                >
                  <Typography variant={TypographyVariant.Body2}>
                    Neurodivergent Mates
                  </Typography>
                </Link>
              </li>
              <li className={styles.li}>
                <Link
                  href='/services/neurodiversitytraining'
                  onClick={handleToggleDropdown}
                >
                  <Typography variant={TypographyVariant.Body2}>
                    Neurodiversity Training
                  </Typography>
                </Link>
              </li>
              <li className={styles.li}>
                <Link
                  href='/services/advisoryconsulting'
                  onClick={handleToggleDropdown}
                >
                  <Typography variant={TypographyVariant.Body2}>
                    Advisory Consulting
                  </Typography>
                </Link>
              </li>
              <li className={styles.li}>
                <Link
                  href='/services/networking'
                  onClick={handleToggleDropdown}
                >
                  <Typography variant={TypographyVariant.Body2}>
                    Networking & Workshops
                  </Typography>
                </Link>
              </li>
              <li className={styles.li}>
                <Link href='/services/coaching' onClick={handleToggleDropdown}>
                  <Typography variant={TypographyVariant.Body2}>
                    Career coaching
                  </Typography>
                </Link>
              </li>
              <li className={styles.li}>
                <Link
                  href='/services/placements'
                  onClick={handleToggleDropdown}
                >
                  <Typography variant={TypographyVariant.Body2}>
                    Placements
                  </Typography>
                </Link>
              </li>
              <li className={styles.li}>
                <Link href='/about' onClick={handleToggleDropdown}>
                  <Typography variant={TypographyVariant.Body2}>
                    About Us
                  </Typography>
                </Link>
              </li>
              <li className={styles.li}>
                <Link href='/contact' onClick={handleToggleDropdown}>
                  <Typography variant={TypographyVariant.Body2}>
                    Contact
                  </Typography>
                </Link>
              </li>
              {<UserOutlet />}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
