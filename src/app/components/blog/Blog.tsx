import React from 'react';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './blog.module.css';
import Image from 'next/image';
import { BlogInterface } from '@/app/interfaces/BlogInterface';
import LearnMore from '../LearnMore/LearnMore';
import { slugify } from '@/app/utilities/common';

export default function Blog({
  //id,
  title,
  imageUrl,
  description,
}: BlogInterface): JSX.Element {
  const blogSlug = slugify(title);
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <Image src={imageUrl} alt={`Thumbnail for ${title}`} fill={true} />
      </div>
      <div className={styles.descriptionContainer}>
        <div className={styles.description}>
          <Typography variant={TypographyVariant.Body2}>
            {description}
          </Typography>
        </div>
        <LearnMore dest={`/blogs/blog/?title=${blogSlug}`} />
      </div>
    </div>
  );
}
