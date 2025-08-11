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
import { HOST_URL, META_KEY } from '@/app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';
import { slugify } from '@/app/utilities/common';

export async function generateMetadata(
  props: MetadataProps
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const titleSlug = searchParams?.title;
  const { blogs } = blogData;
  const blog = blogs.find(({ title }) => slugify(title) === titleSlug);

  if (!blog) {
    return {};
  }

  const { title, keywords, imageUrl, description } = blog;
  const canonical = `${HOST_URL}/blogs/blog?title=${titleSlug}`;
  const images = [{ url: imageUrl }];

  return createMetadata(META_KEY.BLOG, {
    title,
    keywords,
    description,
    canonical,
    images,
  });
}

export default async function OneBlog(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const titleSlug = searchParams?.title as string;
  const { blogs } = blogData;
  const blog = blogs.find((blog) => slugify(blog.title) === titleSlug);

  if (!blog) {
    return (
      <Typography variant={TypographyVariant.H1}>Blog not found</Typography>
    );
  }

  return (
    <div className={styles.container}>
      <TextHeavyBlog {...blog} />
      {blog.scriptSrc && blog.containerId && (
        <DisplayPodcast
          scriptSrc={blog.scriptSrc}
          containerId={blog.containerId}
          singleBlog={true}
        />
      )}
      <BlogList searchParams={searchParams} />
      <Subscribe />
    </div>
  );
}
