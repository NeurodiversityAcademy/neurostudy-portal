import React from 'react';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './article.module.css';
import { ArticleInterface } from '@/app/interfaces/ArticleInterface';
import Image from 'next/image';
import LearnMore from '../LearnMore/LearnMore';
import { slugify } from '@/app/utilities/common';

export default function Article({
  title,
  imageUrl,
  description,
}: ArticleInterface): JSX.Element {
  const articleSlug = slugify(title);
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
        <LearnMore dest={`/articles/article/?title=${articleSlug}`} />
      </div>
    </div>
  );
}
