import React from 'react';
import styles from './blog.module.css';
import blogData from '../blogData.json';
import Typography, {
  TypographyVariant,
} from '../../components/typography/Typography';
import TextHeavyBlog from '../../components/textHeavyBlog/textHeavyBlog';
import BlogList from '@/app/components/blogList/blogList';
import DisplayPodcast from '@/app/components/podcast/DisplayPodcast';
import Subscribe from '@/app/components/subscribe/subscribe';
import { MetadataProps } from '@/app/interfaces/MetadataProps';
import { Metadata } from 'next';
import {
  BUZZSPROUT_CONTAINER_ID,
  HOST_URL,
  META_KEY,
  PODCAST_LINK,
} from '@/app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const blogId = searchParams.blogId;
  const { blogs } = blogData;
  const blog = blogs.find(({ id }) => id === blogId);

  if (!blog) {
    return {};
  }

  const { title, keywords, imageUrl, description } = blog;
  // NOTE
  // Previous `type` was 'blog', which the `openGraph` attribute doesn't accept as `type`
  const canonical = `${HOST_URL}/blogs/blog?blogId=${blogId}`;
  const images = [{ url: imageUrl }];

  return createMetadata(META_KEY.BLOG, {
    title,
    keywords,
    description,
    canonical,
    images,
  });
}

export default function OneBlog({ searchParams }: MetadataProps) {
  const blogId = searchParams.blogId;
  const { blogs } = blogData;
  const blog = blogs.find(({ id }) => id === blogId);

  if (!blog) {
    return (
      <Typography variant={TypographyVariant.H1}>Blog not found</Typography>
    );
  }

  const {
    id,
    imageUrl,
    header,
    bodyText,
    scriptSrc,
    containerId,
    podcastLink,
  } = blog;

  return (
    <div className={styles.container}>
      <TextHeavyBlog
        id={id}
        header={header}
        imageUrl={imageUrl}
        bodyText={bodyText}
        scriptSrc={scriptSrc}
        containerId={containerId}
        podcastLink={podcastLink}
      />{' '}
      {scriptSrc != '' && containerId != '' && (
        <DisplayPodcast
          scriptSrc={PODCAST_LINK}
          containerId={BUZZSPROUT_CONTAINER_ID}
          singleBlog={false}
        />
      )}
      <BlogList />
      <Subscribe />
    </div>
  );
}
