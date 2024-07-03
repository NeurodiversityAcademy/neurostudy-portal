import React from 'react';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './blog.module.css';
import Image from 'next/image';
import { BlogInterface } from '@/app/interfaces/BlogInterface';
import LearnMore from '../LearnMore/LearnMore';

export default function Blog({
  id,
  title,
  imageUrl,
  description,
}: BlogInterface): JSX.Element {
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
        <LearnMore dest={`/blogs/blog/?blogId=${id}`} />
      </div>
    </div>
  );
}
