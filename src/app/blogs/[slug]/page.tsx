import React from 'react';
import styles from '../blog.module.css';
import blogData from '../blogData.json';
import Typography, {
  TypographyVariant,
} from '../../components/typography/Typography';
import TextHeavyBlog from '../../components/textHeavyBlog/textHeavyBlog';
import DisplayPodcast from '@/app/components/podcast/DisplayPodcast';
import Subscribe from '@/app/components/subscribe/subscribe';
import { Metadata } from 'next';
import { HOST_URL, META_KEY } from '@/app/utilities/constants';
import { createMetadata, slugify } from '@/app/utilities/common';
import VisitTrackerWrapper from '@/app/components/wrapper/VisitTrackerWrapper';
import BlogList from '@/app/components/blogList/blogList';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const { blogs } = blogData;
  const blog = blogs.find(({ title }) => slugify(title) === slug);

  if (!blog) {
    return {};
  }

  const { title, keywords, imageUrl, description } = blog;
  const canonical = `${HOST_URL}/blogs/${slug}`;
  const images = [{ url: imageUrl }];

  return createMetadata(META_KEY.BLOG, {
    title,
    keywords,
    description,
    canonical,
    images,
  });
}

export default function OneBlog({ params }: Props) {
  const { slug } = params;
  const { blogs } = blogData;
  const blog = blogs.find((blog) => slugify(blog.title) === slug);

  if (!blog) {
    return (
      <Typography variant={TypographyVariant.H1}>Blog not found</Typography>
    );
  }
  const { id, header, imageUrl, bodyText, scriptSrc, containerId } = blog;
  return (
    <div className={styles.container}>
      <VisitTrackerWrapper id={id} type='blog' />
      <TextHeavyBlog
        id={id}
        header={header}
        imageUrl={imageUrl}
        bodyText={bodyText}
      />{' '}
      {scriptSrc !== '' && containerId !== '' && (
        <DisplayPodcast
          scriptSrc={blog.scriptSrc}
          containerId={blog.containerId}
          singleBlog={true}
        />
      )}
      <BlogList />
      <Subscribe />
    </div>
  );
}
