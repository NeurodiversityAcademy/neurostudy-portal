import React from 'react';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './article.module.css';
import { ArticleInterface } from '@/app/interfaces/ArticleInterface';
import Image from 'next/image';
import LearnMore from '../LearnMore/LearnMore';

export default function Article({
  id,
  title,
  imageUrl,
  description,
}: ArticleInterface): JSX.Element {
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
        <LearnMore dest={`/articles/article/?articleId=${id}`} />
      </div>
    </div>
  );
}
