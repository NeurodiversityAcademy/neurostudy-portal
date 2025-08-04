import React from 'react';
import Blog from './Blog';
import blogData from '../../blogs/blogData.json';
import styles from './blog.module.css';
import { BlogInterface } from '@/app/interfaces/BlogInterface';
import { slugify } from '@/app/utilities/common';

interface BlogCardListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const BlogCardList = ({ searchParams }: BlogCardListProps) => {
  const titleSlug = searchParams.title as string;
  const blogs: BlogInterface[] = blogData.blogs
    .filter((blog) => slugify(blog.title) != titleSlug)
    .reverse()
    .slice(0, 3);

  return (
    <div className={styles.cardList}>
      {blogs.map((blog: BlogInterface) => (
        <Blog key={blog.id} {...blog} />
      ))}
    </div>
  );
};

export default BlogCardList;
