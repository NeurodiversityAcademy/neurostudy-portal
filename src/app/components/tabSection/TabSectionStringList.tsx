'use client';

import Image from 'next/image';
import CheckIcon from '@/app/components/images/Check';
import closeIcon from '@/app/images/close.svg';
import Typography, { TypographyVariant } from '../typography/Typography';
import type { TabIconType } from './tabSectionTypes';

export interface TabSectionStringListLink {
  label: string;
  href: string;
}

export interface TabSectionStringListProps {
  items: string[];
  iconType: TabIconType;
  listClassName: string;
  itemClassName: string;
  positiveIconClassName?: string;
  /** Optional source links rendered below the list. */
  links?: TabSectionStringListLink[];
  sourceListClassName?: string;
  sourceLinkClassName?: string;
}

export default function TabSectionStringList({
  items,
  iconType,
  listClassName,
  itemClassName,
  positiveIconClassName,
  links,
  sourceListClassName,
  sourceLinkClassName,
}: TabSectionStringListProps) {
  return (
    <>
      <ul className={listClassName}>
        {items.map((item) => (
          <li key={item} className={itemClassName}>
            {iconType === 'check' ? <CheckIcon className={positiveIconClassName} /> : null}
            {iconType === 'close' ? <Image src={closeIcon} alt='' width={30} height={30} /> : null}
            <Typography variant={TypographyVariant.Body3}>{item}</Typography>
          </li>
        ))}
      </ul>
      {links?.length ? (
        <div className={sourceListClassName}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className={sourceLinkClassName}
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </>
  );
}
