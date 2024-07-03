'use client';
import React from 'react';
import { TextHeavyInterface } from '@/app/interfaces/TextHeavyInterface';
import Typography, { TypographyVariant } from '../typography/Typography';
import Image from 'next/image';
import Link from 'next/link';
import styles from './textHeavyArticle.module.css';
import DOMPurify from 'isomorphic-dompurify';
import useWindowWidth from '@/app/hooks/useWindowWidth';

export default function TextHeavyArticle({
  header,
  imageUrl,
  bodyText,
}: TextHeavyInterface): JSX.Element {
  const windowWidth = useWindowWidth();

  const paragraphs = bodyText.split('\n').map((paragraph, index) => {
    const sanitizedHTML = DOMPurify.sanitize?.(paragraph);
    return (
      <div key={index}>
        <Typography key={index} variant={TypographyVariant.Body2}>
          <div
            className={styles.paragraph}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        </Typography>
        <br></br>
      </div>
    );
  });

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
          <Link href='/'>Home</Link> {'>'}{' '}
          <Link href='/articles'>Articles</Link> {'>'} {header}
        </Typography>
      </div>
      <Typography variant={TypographyVariant.H2}>{header}</Typography>
      <div className={styles.imageWrapper}>
        <Image src={imageUrl} alt={`image for ${header}`} fill={true} />
      </div>
      <div className={styles.articleText}>{paragraphs}</div>
    </div>
  );
}
